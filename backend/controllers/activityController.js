
const { 
  sequelize, 
  Category,
  Activity, 
  ActivityDetail, 
  CarbonCalculation, 
  Material 
} = require("../models");

const { calculateCarbonFootprint } = require("../services/carbonCalculationService");

// ตัวช่วยแปลงค่าตัวเลข ป้องกัน NaN หรือ Null Error
const parseSafeInt = (val) => {
  if (val === null || val === undefined || val === '') return null;
  const num = parseInt(val, 10);
  return isNaN(num) ? null : num;
};

const parseSafeFloat = (val) => {
  if (val === null || val === undefined || val === '') return 0;
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
};

const CATEGORY_NAMES = {
  1: "การเผาไหม้แบบอยู่กับที่ (Stationary Combustion) ",
  2: "การเผาไหม้ที่มีการเคลื่อนที่ (Mobile Combustion) ",
  3: "การรั่วไหลของสารจากอุปกรณ์ต่างๆ (Fugitive Emissions) ",
  4: "พลังงานไฟฟ้าที่ซื้อมาใช้งาน (Purchased Electricity) ",
  5: "พลังงานไอน้ำที่ซื้อมาใช้งาน (Purchased Steam) ",
  6: "พลังงานความร้อนที่ซื้อมาใช้งาน (purchased heat) ",
  7: "พลังงานความเย็นที่ซื้อมาใช้งาน (Purchased Cooling) ",
  8: "การซื้อวัตถุดิบและบริการ (Purchased Goods and Service) ",
  9: "การขนส่งและกระจายสินค้า (Upstream Transportation) ",
  10: "ของเสียจากอาหาร (Food Waste) "
};

// ========================================
// 1. ดึงรายการกิจกรรมทั้งหมด (GET /api/activities)
// ========================================
const getActivities = async (req, res) => {
  try {
    const user_id = req.user.id;

    const userRole = String(req.user?.role?.name || req.user?.role || '').toUpperCase();

    // ถ้าเป็น ADMIN หรือ MANAGER ให้ดึงทั้งหมด ({}) 
    // ถ้าเป็น User ทั่วไป ให้ดึงเฉพาะกิจกรรมของตัวเอง ({ user_id })
    const whereCondition = (userRole === 'ADMIN' || userRole === 'MANAGER') 
      ? {} 
      : { user_id };

    const activities = await Activity.findAll({
      where: whereCondition,
      include: [
        {
          model: ActivityDetail,
          as: 'details',
          required: false,
          include: [
            {
              model: Material,
              as: 'Material',
              attributes: ['id', 'name', 'default_unit'],
              required: false
            },
            
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const formattedActivities = activities.map(act => {
      const plainAct = act.get({ plain: true });
      const details = plainAct.details || [];

      // 1. คำนวณคาร์บอนรวมจากทุกรายการย่อย
      const totalCarbon = details.reduce((sum, d) => sum + parseFloat(d.carbon_footprint || 0), 0);

      // 2. ดึง Scope ทั้งหมดที่มีในกิจกรรมนี้แบบไม่ซ้ำกัน (เช่น [1, 2])
      const scopeList = [...new Set(details.map(d => d.scope_id).filter(Boolean))].sort((a, b) => a - b);

      // 3. รวบรวมประเภทกิจกรรม / หมวดหมู่ จากรายการย่อย (ป้องกัน null)
      const categoryList = [...new Set(
        details.map(d => {
          const catId = d.category_id || plainAct.category_id;
          return CATEGORY_NAMES[catId] || (catId ? `Category ${catId}` : null);
        }).filter(Boolean)
      )];

      return {
        ...plainAct,
        total_co2e: totalCarbon,
        scopes: scopeList,
        categories: categoryList
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedActivities
    });
  } catch (error) {
    console.error("❌ GET ACTIVITIES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "ไม่สามารถดึงข้อมูลกิจกรรมได้",
      error: error.message
    });
  }
};

// ========================================
// 2. สร้างกิจกรรมใหม่แบบ Multi-Material (POST /api/activities)
// ========================================
const createActivity = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const user_id = req.user.id;
    const { name, description, activity_date, items, details } = req.body;
    const itemList = items || details || [];

    if (!itemList || !Array.isArray(itemList) || itemList.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: "กรุณาระบุอย่างน้อย 1 รายการย่อย" });
    }

    // บันทึก Header กิจกรรมหลัก
    const activity = await Activity.create({
      user_id: parseSafeInt(user_id),
      name: name ? name.trim() : "กิจกรรมไม่มีชื่อ",
      description: description ? description.trim() : null,
      activity_date: activity_date || new Date().toISOString().split('T')[0],
      data_source: "OTHER"
    }, { transaction });

    let totalCarbonSum = 0;

    // วนลูปบันทึกรายการย่อยลงตาราง activity_details
    for (const item of itemList) {
      const matId = parseSafeInt(item.material_id);
      const actTypeId = parseSafeInt(item.activity_type_id);
      const scopeId = parseSafeInt(item.scope_id);
      const catId = parseSafeInt(item.category_id);
      const qty = parseSafeFloat(item.quantity);

      // ดึงข้อมูล Material เพื่อหา emission_factor และ default_unit
       // ปรับแก้บรรทัดนี้ใน createActivity และ updateActivity
const material = matId ? await Material.findByPk(matId, { 
  attributes: ['id', 'name', 'default_unit'], 
  transaction 
}) : null;
      const efValue = parseSafeFloat(material?.emission_factor || 1);
      
      const itemCarbon = (item.carbon_footprint !== undefined && item.carbon_footprint !== null && !isNaN(parseFloat(item.carbon_footprint)))
        ? parseSafeFloat(item.carbon_footprint)
        : qty * efValue;

      totalCarbonSum += itemCarbon;

      // บันทึกลง activity_details (พร้อมค่า Fallback ป้องกัน NOT NULL Violation)
      await ActivityDetail.create({
        activity_id: activity.id,
        scope_id: scopeId,
        category_id: catId,
        activity_type_id: actTypeId,
        material_id: matId || 1, // Fallback หากไม่ได้ส่ง material_id มา
        quantity: qty,
        unit: item.unit || material?.default_unit || "kg",
        carbon_footprint: itemCarbon
      }, { transaction });
    }

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: "บันทึกกิจกรรมเรียบร้อยแล้ว",
      data: { activity, total_co2e: totalCarbonSum }
    });

  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error("❌ CREATE ACTIVITY ERROR DETAILS:", error);
    return res.status(500).json({ 
      success: false, 
      message: `เกิดข้อผิดพลาดในการบันทึก: ${error.message || "Internal Server Error"}`,
      sqlMessage: error.original?.sqlMessage || null,
      detail: error.parent?.message || null
    });
  }
};

// ========================================
// 3. GET /api/activities/:id
// ========================================
const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findByPk(id, {
      include: [
        {
          model: ActivityDetail,
          as: "details",
          include: [
            {
              model: Material,
              as: "Material",
              attributes: ["id", "name", "default_unit"]
            }
          ]
        }
      ]
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบ Activity ที่ต้องการ"
      });
    }

    return res.status(200).json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error("Get activity error:", error);
    return res.status(500).json({
      success: false,
      message: "ไม่สามารถดึงข้อมูล Activity ได้",
      error: error.message
    });
  }
};

// ========================================
// 4. DELETE /api/activities/:id
// ========================================
// backend/controllers/activityController.js

const deleteActivity = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const user_id = req.user?.id;
    const userRole = String(req.user?.role?.name || req.user?.role || '').toUpperCase();

    // 1. ค้นหากิจกรรมที่ต้องการลบ
    const activity = await Activity.findByPk(id, { transaction });
    if (!activity) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "ไม่พบกิจกรรมที่ต้องการลบ"
      });
    }

    // 2. ตรวจสอบสิทธิ์ (ADMIN, MANAGER หรือ เจ้าของกิจกรรม สามารถลบได้)
    if (userRole !== 'ADMIN' && userRole !== 'MANAGER' && activity.user_id !== user_id) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: "คุณไม่มีสิทธิ์ลบกิจกรรมนี้"
      });
    }

    // 3. ลบข้อมูลตารางลูกก่อน เพื่อป้องกัน Foreign Key Constraint Violations
    if (ActivityDetail) {
      await ActivityDetail.destroy({
        where: { activity_id: id },
        transaction
      });
    }

    if (CarbonCalculation) {
      try {
        await CarbonCalculation.destroy({
          where: { activity_id: id },
          transaction
        });
      } catch (calcErr) {
        console.warn("⚠️ Warning: Could not delete carbon calculations:", calcErr.message);
      }
    }

    // 4. ลบกิจกรรมหลัก (Header)
    await activity.destroy({ transaction });

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "ลบกิจกรรมเรียบร้อยแล้ว"
    });

  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error("❌ DELETE ACTIVITY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: `เกิดข้อผิดพลาดในการลบกิจกรรม: ${error.message || "Internal Server Error"}`,
      sqlMessage: error.original?.sqlMessage || null
    });
  }
};

// ========================================
// 5. PUT /api/activities/:id
// ========================================
const updateActivity = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const userRole = String(req.user?.role?.name || req.user?.role || '').toUpperCase();

    const { name, description, activity_date, items, details } = req.body || {};
    const itemList = items || details || [];

    const activity = await Activity.findByPk(id, { transaction });

    if (!activity) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "ไม่พบ Activity ที่ต้องการแก้ไข"
      });
    }

    if (userRole !== 'ADMIN' && userRole !== 'MANAGER' && activity.user_id !== user_id) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: "คุณไม่มีสิทธิ์แก้ไขกิจกรรมนี้"
      });
    }

    // อัปเดตข้อมูล Header
    await activity.update({
      name: name !== undefined ? name.trim() : activity.name,
      description: description !== undefined ? description : activity.description,
      activity_date: activity_date || activity.activity_date
    }, { transaction });

    // หากมีการส่งรายการย่อยมาปรับปรุง ให้ลบของเก่าแล้วบันทึกใหม่
    if (Array.isArray(itemList) && itemList.length > 0) {
      await ActivityDetail.destroy({ where: { activity_id: id }, transaction });

      for (const item of itemList) {
        const matId = parseSafeInt(item.material_id);
        const qty = parseSafeFloat(item.quantity);
        // ปรับแก้บรรทัดนี้ใน createActivity และ updateActivity
const material = matId ? await Material.findByPk(matId, { 
  attributes: ['id', 'name', 'default_unit'], 
  transaction 
}) : null;
        const efValue = parseSafeFloat(material?.emission_factor || 1);
        const itemCarbon = parseSafeFloat(item.carbon_footprint) || (qty * efValue);

        await ActivityDetail.create({
          activity_id: activity.id,
          scope_id: parseSafeInt(item.scope_id),
          category_id: parseSafeInt(item.category_id),
          activity_type_id: parseSafeInt(item.activity_type_id),
          material_id: matId || 1,
          quantity: qty,
          unit: item.unit || material?.default_unit || "kg",
          carbon_footprint: itemCarbon
        }, { transaction });
      }
    }

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "แก้ไข Activity เรียบร้อยแล้ว",
      data: { activity }
    });

  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error("Update activity error:", error);
    return res.status(500).json({
      success: false,
      message: "ไม่สามารถแก้ไข Activity ได้",
      error: error.message
    });
  }
};

module.exports = {
  createActivity,
  getActivities,
  getActivityById,
  deleteActivity,
  updateActivity
};
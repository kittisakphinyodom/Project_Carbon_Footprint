// // const {
// //     Activity,
// //     ActivityDetail,
// //     User,
// //     EmissionFactor,
// //     CarbonCalculation,
// //     Material,
// //     Scope,
// //     ScopeCategory,
// //     ActivityType
// // } = require("../models");

// // ด้านบนสุดของไฟล์ backend/controllers/activityController.js
// const { 
//   sequelize,
//   Activity, 
//   ActivityDetail, 
//   CarbonCalculation, 
//   Material 
// } = require("../models");



// const {
//     calculateCarbonFootprint
// } = require("../services/carbonCalculationService");

// // const createActivity = async (req, res) => {
// //     const transaction = await sequelize.transaction();
// //     try {
// //         console.log("📦 Payload from React:", req.body);
// //         const {
// //     name,
// //     scope_id,
// //     category_id,
// //     activity_type_id,
// //     material_id,
// //     supplier_id,
// //     activity_date,
// //     quantity,
// //     unit,
// //     description,
// //     data_source
// // } = req.body;
// // const user_id = req.user.id;

// //         // ========================================
// //         // Validate required fields
// //         // ========================================

// //         if (!name || !name.trim()) {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "กรุณาระบุชื่อกิจกรรม"
// //         });
// // }

// //         if (!scope_id) {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "กรุณาระบุ scope_id"
// //             });
// //         }

// //         if (!category_id) {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "กรุณาระบุ category_id"
// //             });
// //         }

// //         if (!activity_type_id) {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "กรุณาระบุ activity_type_id"
// //             });
// //         }

// //         if (!material_id) {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "กรุณาระบุ material_id"
// //             });
// //         }

// //         if (!activity_date) {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "กรุณาระบุ activity_date"
// //             });
// //         }

// //         if (quantity === undefined || quantity === null) {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "กรุณาระบุ quantity"
// //             });
// //         }

// //         if (isNaN(Number(quantity))) {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "quantity ต้องเป็นตัวเลข"
// //             });
// //         }

// //         if (Number(quantity) < 0) {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "quantity ต้องไม่ติดลบ"
// //             });
// //         }

// //         if (!unit) {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "กรุณาระบุ unit"
// //             });
// //         }

// //         // ========================================
// //         // Find Active Emission Factor
// //         // ========================================

// //         const emissionFactor = await EmissionFactor.findOne({
// //             where: {
// //                 material_id: material_id,
// //                 status: "ACTIVE"
// //             },
// //             order: [
// //                 ["priority", "ASC"],
// //                 ["id", "DESC"]
// //             ]
// //         });

// //         if (!emissionFactor) {
// //             return res.status(404).json({
// //                 success: false,
// //                 message: "ไม่พบ Emission Factor ที่ใช้งานสำหรับ Material นี้"
// //             });
// //         }

// //         // ========================================
// //         // Check Unit
// //         // ========================================

// //         if (
// //             emissionFactor.unit &&
// //             unit !== emissionFactor.unit
// //         ) {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "หน่วยของ Activity ไม่ตรงกับ Emission Factor",
// //                 data: {
// //                     input_unit: unit,
// //                     emission_factor_unit: emissionFactor.unit
// //                 }
// //             });
// //         }

// //         // ========================================
// //         // Calculate Carbon Footprint
// //         // ========================================

// //         const calculation = calculateCarbonFootprint({
// //             quantity: Number(quantity),
// //             emissionFactor: emissionFactor
// //         });

// //         // ========================================
// //         // Create Activity
// //         // ========================================

// //         const activity = await Activity.create({
// //             user_id,
// //             name: name.trim(),
// //             scope_id,
// //             category_id,
// //             activity_type_id,
// //             material_id,
// //             supplier_id: supplier_id || null,
// //             activity_date,
// //             quantity: Number(quantity),
// //             unit,
// //             description: description || null,
// //             data_source: data_source || "OTHER",
// //             status: "DRAFT"
// //         });

// //         // ========================================
// //         // Create Carbon Calculation
// //         // ========================================

// //         const carbonCalculation = await CarbonCalculation.create({
// //             activity_id: activity.id,
// //             emission_factor_id: emissionFactor.id,
// //             quantity: Number(quantity),
// //             factor_value: calculation.emission_factor,
// //             co2_result: 0,
// //             ch4_result: 0,
// //             n2o_result: 0,
// //             total_co2e: calculation.total_co2e,
// //             calculation_type: "EMISSION",
// //             calculation_method: "ACTIVITY_BASED"
// //         });

// //         // ========================================
// //         // Response
// //         // ========================================

// //         return res.status(201).json({
// //             success: true,
// //             message: "บันทึก Activity และคำนวณ Carbon Footprint สำเร็จ",

// //             data: {
// //                 activity: {
// //                     id: activity.id,
// //                     user_id: activity.user_id,
// //                     scope_id: activity.scope_id,
// //                     category_id: activity.category_id,
// //                     activity_type_id: activity.activity_type_id,
// //                     material_id: activity.material_id,
// //                     activity_date: activity.activity_date,
// //                     quantity: activity.quantity,
// //                     unit: activity.unit,
// //                     description: activity.description,
// //                     data_source: activity.data_source,
// //                     status: activity.status
// //                 },

// //                 calculation: {
// //                     id: carbonCalculation.id,
// //                     emission_factor_id: emissionFactor.id,
// //                     emission_factor: calculation.emission_factor,
// //                     quantity: calculation.quantity,
// //                     total_co2e: calculation.total_co2e,
// //                     co2e_unit: "kgCO2e",
// //                     calculation_type: "EMISSION",
// //                     calculation_method: "ACTIVITY_BASED"
// //                 }
// //             }
// //         });

// //     } catch (error) {

// //         console.error(
// //             "Create activity and carbon calculation error:",
// //             error
// //         );

// //         return res.status(500).json({
// //             success: false,
// //             message: "เกิดข้อผิดพลาดในการบันทึก Activity และคำนวณ Carbon Footprint",
// //             error: error.message
// //         });
// //     }
// // };

// // const createActivity = async (req, res) => {
// //   const transaction = await sequelize.transaction();
// //   try {
// //     const user_id = req.user.id;
// //     const { name, description, activity_date, items, details } = req.body;
// //     const itemList = items || details || [];

// //     if (!itemList || !Array.isArray(itemList) || itemList.length === 0) {
// //       await transaction.rollback();
// //       return res.status(400).json({ success: false, message: "กรุณาระบุอย่างน้อย 1 รายการย่อย" });
// //     }

// //     const firstItem = itemList[0] || {};

// //     // สร้าง Record หลักใน Activity Table
// //     const activity = await Activity.create({
// //       user_id,
// //       name: name ? name.trim() : "กิจกรรมไม่มีชื่อ",
// //       description: description ? description.trim() : null,
// //       activity_date: activity_date || new Date().toISOString().split('T')[0],
// //       data_source: "OTHER",
      
// //       // Fallback ค่ารายการแรกเผื่อ Schema ตารางเดิมติด NOT NULL
// //       scope_id: firstItem.scope_id || null,
// //       category_id: firstItem.category_id || null,
// //       activity_type_id: firstItem.activity_type_id || null,
// //       material_id: firstItem.material_id || null,
// //       quantity: firstItem.quantity || 0,
// //       unit: firstItem.unit || ""
// //     }, { transaction });

// //     let totalCarbonSum = 0;

// //     // Loop บันทึกรายการย่อย
// //     for (const item of itemList) {
// //       const material = await Material.findByPk(item.material_id, { transaction });
// //       const efValue = Number(material?.emission_factor || 1);
// //       const qty = Number(item.quantity || 0);
      
// //       const itemCarbon = item.carbon_footprint !== undefined 
// //         ? Number(item.carbon_footprint) 
// //         : qty * efValue;
        
// //       totalCarbonSum += itemCarbon;

// //       // บันทึกลง activity_details
// //       await ActivityDetail.create({
// //         activity_id: activity.id,
// //         scope_id: item.scope_id || null,
// //         category_id: item.category_id || null,
// //         activity_type_id: item.activity_type_id,
// //         material_id: item.material_id,
// //         quantity: qty,
// //         unit: item.unit || material?.default_unit || "",
// //         carbon_footprint: itemCarbon
// //       }, { transaction });

// //       // บันทึกลง carbon_calculations
// //       await CarbonCalculation.create({
// //         activity_id: activity.id,
// //         material_id: item.material_id,
// //         quantity: qty,
// //         factor_value: efValue,
// //         total_co2e: itemCarbon,
// //         calculation_type: "EMISSION",
// //         calculation_method: "ACTIVITY_BASED"
// //       }, { transaction });
// //     }

// //     await transaction.commit();

// //     return res.status(201).json({
// //       success: true,
// //       message: "บันทึกกิจกรรมเรียบร้อยแล้ว",
// //       data: { activity, total_co2e: totalCarbonSum }
// //     });

// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Create Activity Error Details:", error);
// //     return res.status(500).json({ 
// //       success: false, 
// //       message: "เกิดข้อผิดพลาดในการบันทึก Activity และคำนวณ Carbon Footprint", 
// //       error: error.message 
// //     });
// //   }
// // };
//  const parseSafeInt = (val) => {
//     const num = parseInt(val, 10);
//     return isNaN(num) ? null : num;
//   };

//   const parseSafeFloat = (val) => {
//     const num = parseFloat(val);
//     return isNaN(num) ? 0 : num;
//   };
// // const createActivity = async (req, res) => {
 

// //   const transaction = await sequelize.transaction();

// //   try {
// //     const user_id = req.user.id;
// //     const { name, description, activity_date, items, details } = req.body;
// //     const itemList = items || details || [];

// //     if (!itemList || !Array.isArray(itemList) || itemList.length === 0) {
// //       await transaction.rollback();
// //       return res.status(400).json({ success: false, message: "กรุณาระบุอย่างน้อย 1 รายการย่อย" });
// //     }

// //     // 1. สร้าง Record หลักใน Activity Table (Header Only)
// //     // กำหนด material_id เป็น null เพื่อข้ามข้อจำกัด Foreign Key เก่าในตาราง activities
// //     const activity = await Activity.create({
// //       user_id: parseSafeInt(user_id),
// //       name: name ? name.trim() : "กิจกรรมไม่มีชื่อ",
// //       description: description ? description.trim() : null,
// //       activity_date: activity_date || new Date().toISOString().split('T')[0],
// //       data_source: "OTHER",
      
// //       scope_id: null,
// //       category_id: null,
// //       activity_type_id: null,
// //       material_id: null, // 👈 ต้องเป็น null บน Header
// //       quantity: 0,
// //       unit: null
// //     }, { transaction });

// //     let totalCarbonSum = 0;

// //     // 2. Loop บันทึกรายการย่อยลง activity_details
// //     for (const item of itemList) {
// //       const matId = parseSafeInt(item.material_id);
// //       const actTypeId = parseSafeInt(item.activity_type_id);
// //       const scopeId = parseSafeInt(item.scope_id);
// //       const catId = parseSafeInt(item.category_id);
// //       const qty = parseSafeFloat(item.quantity);

// //       const material = matId ? await Material.findByPk(matId, { transaction }) : null;
// //       const efValue = parseSafeFloat(material?.emission_factor || 1);
      
// //       const itemCarbon = item.carbon_footprint !== undefined && !isNaN(parseFloat(item.carbon_footprint))
// //         ? parseSafeFloat(item.carbon_footprint)
// //         : qty * efValue;

// //       totalCarbonSum += itemCarbon;

// //       // บันทึกลง activity_details
// //       await ActivityDetail.create({
// //         activity_id: activity.id,
// //         scope_id: scopeId,
// //         category_id: catId,
// //         activity_type_id: actTypeId,
// //         material_id: matId,
// //         quantity: qty,
// //         unit: item.unit || material?.default_unit || "unit",
// //         carbon_footprint: itemCarbon
// //       }, { transaction });

// //       // บันทึกลง carbon_calculations
// //       try {
// //         await CarbonCalculation.create({
// //           activity_id: activity.id,
// //           material_id: matId,
// //           quantity: qty,
// //           factor_value: efValue,
// //           total_co2e: itemCarbon,
// //           calculation_type: "EMISSION",
// //           calculation_method: "ACTIVITY_BASED"
// //         }, { transaction });
// //       } catch (calcErr) {
// //         console.warn("⚠️ Warning: Could not create CarbonCalculation record:", calcErr.message);
// //       }
// //     }

// //     await transaction.commit();

// //     return res.status(201).json({
// //       success: true,
// //       message: "บันทึกกิจกรรมเรียบร้อยแล้ว",
// //       data: { activity, total_co2e: totalCarbonSum }
// //     });

// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Create Activity Error Details:", error);
// //     return res.status(500).json({ 
// //       success: false, 
// //       message: `เกิดข้อผิดพลาดในการบันทึก: ${error.message || "Internal Server Error"}`,
// //       sqlMessage: error.original?.sqlMessage || null
// //     });
// //   }
// // };


// // ========================================
// // GET /api/activities
// // Get all activities
// // ========================================

// // ========================================
// // GET /api/activities
// // Get all activities (Filtered by user_id)
// // ========================================

// // const getActivities = async (req, res) => {
// //     try {
// //         // ดึง user_id จาก token ที่ middleware แนบมาให้
// //         const user_id = req.user.id;

// //         const activities = await Activity.findAll({
// //             // เพิ่มเงื่อนไขให้ดึงเฉพาะข้อมูลที่ user_id ตรงกับคนที่ล็อกอิน
// //             where: {
// //                 user_id: user_id
// //             },
// //             include: [
// //                 {
// //                     model: Material,
// //                     as: "material",
// //                     attributes: ["id", "code", "name", "default_unit"]
// //                 },
// //                 {
// //                     model: Scope,
// //                     as: "scope",
// //                     attributes: ["id", "code", "name"]
// //                 },
// //                 {
// //                     model: ScopeCategory,
// //                     as: "category",
// //                     attributes: ["id", "code", "name"]
// //                 },
// //                 {
// //                     model: ActivityType,
// //                     as: "activityType",
// //                     attributes: ["id", "category_id", "code", "name", "default_unit", "calculation_method"]
// //                 },
// //                 {
// //                     model: CarbonCalculation,
// //                     as: "calculations",
// //                     attributes: [
// //                         "id",
// //                         "emission_factor_id",
// //                         "quantity",
// //                         "factor_value",
// //                         "co2_result",
// //                         "ch4_result",
// //                         "n2o_result",
// //                         "total_co2e",
// //                         "calculation_type",
// //                         "calculation_method",
// //                         "calculated_at"
// //                     ]
// //                 }
// //             ],
// //             order: [
// //                 ["activity_date", "DESC"],
// //                 ["id", "DESC"]
// //             ]
// //         });

// //         return res.status(200).json({
// //             success: true,
// //             count: activities.length,
// //             data: activities
// //         });

// //     } catch (error) {
// //         console.error("Get activities error:", error);

// //         return res.status(500).json({
// //             success: false,
// //             message: "ไม่สามารถดึงข้อมูล Activity ได้",
// //             error: error.message
// //         });
// //     }
// // };

// // backend/controllers/activityController.js

// // const getActivities = async (req, res) => {
// //     try {
// //         const user_id = req.user.id;
// //         const userRole = String(req.user?.role?.name || req.user?.role || '').toUpperCase();

// //         let whereClause = {};
// //         if (userRole !== 'ADMIN' && userRole !== 'MANAGER') {
// //             whereClause.user_id = user_id;
// //         }

// //         const activities = await Activity.findAll({
// //             where: whereClause,
// //             include: [
// //                 // 1. เพิ่ม include User ตรงนี้เพื่อดึงข้อมูลผู้บันทึก
// //                 {
// //                     model: User,
// //                     as: "user", // ปรับ as ให้ตรงตาม Association ใน models/index.js (ถ้าไม่มี alias ให้เอา as ออก)
// //                     attributes: ["id", "username", "first_name", "last_name", "email"]
// //                 },
// //                 {
// //                     model: Material,
// //                     as: "material",
// //                     attributes: ["id", "code", "name", "default_unit"]
// //                 },
// //                 {
// //                     model: Scope,
// //                     as: "scope",
// //                     attributes: ["id", "code", "name"]
// //                 },
// //                 {
// //                     model: ScopeCategory,
// //                     as: "category",
// //                     attributes: ["id", "code", "name"]
// //                 },
// //                 {
// //                     model: ActivityType,
// //                     as: "activityType",
// //                     attributes: ["id", "category_id", "code", "name", "default_unit", "calculation_method"]
// //                 },
// //                 {
// //                     model: CarbonCalculation,
// //                     as: "calculations",
// //                     attributes: [
// //                         "id",
// //                         "emission_factor_id",
// //                         "quantity",
// //                         "factor_value",
// //                         "co2_result",
// //                         "ch4_result",
// //                         "n2o_result",
// //                         "total_co2e",
// //                         "calculation_type",
// //                         "calculation_method",
// //                         "calculated_at"
// //                     ]
// //                 }
// //             ],
// //             order: [
// //                 ["activity_date", "DESC"],
// //                 ["id", "DESC"]
// //             ]
// //         });

// //         return res.status(200).json({
// //             success: true,
// //             count: activities.length,
// //             data: activities
// //         });

// //     } catch (error) {
// //         console.error("Get activities error:", error);
// //         return res.status(500).json({
// //             success: false,
// //             message: "ไม่สามารถดึงข้อมูล Activity ได้",
// //             error: error.message
// //         });
// //     }
// // };

// const getActivities = async (req, res) => {
//   try {
//     const user_id = req.user.id;

//     const activities = await Activity.findAll({
//       where: { user_id },
//       include: [
//         {
//           model: ActivityDetail,
//           as: 'details',
//           required: false,
//           include: [
//             {
//               model: Material,
//               as: 'Material',
//               attributes: ['id', 'name', 'default_unit'],
//               required: false
//             }
//           ]
//         }
//       ],
//       order: [['created_at', 'DESC']]
//     });

//     return res.status(200).json({
//       success: true,
//       data: activities
//     });
//   } catch (error) {
//     console.error("❌ GET ACTIVITIES ERROR:", error);
//     return res.status(500).json({
//       success: false,
//       message: "ไม่สามารถดึงข้อมูลกิจกรรมได้",
//       error: error.message
//     });
//   }
// };

// const createActivity = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const user_id = req.user.id;
//     const { name, description, activity_date, items, details } = req.body;
//     const itemList = items || details || [];

//     if (!itemList || !Array.isArray(itemList) || itemList.length === 0) {
//       await transaction.rollback();
//       return res.status(400).json({ success: false, message: "กรุณาระบุอย่างน้อย 1 รายการย่อย" });
//     }

//     // บันทึก Header กิจกรรมหลัก (ปล่อยฟิลด์ Material เป็น NULL)
//     const activity = await Activity.create({
//   user_id: parseSafeInt(user_id),
//   name: name ? name.trim() : "กิจกรรมไม่มีชื่อ",
//   description: description ? description.trim() : null,
//   activity_date: activity_date || new Date().toISOString().split('T')[0],
//   data_source: "OTHER"
// }, { transaction });

//     let totalCarbonSum = 0;

//     // วนลูปบันทึกรายการย่อยลงตาราง activity_details
//     for (const item of itemList) {
//       const matId = parseSafeInt(item.material_id);
//       const actTypeId = parseSafeInt(item.activity_type_id);
//       const scopeId = parseSafeInt(item.scope_id);
//       const catId = parseSafeInt(item.category_id);
//       const qty = parseSafeFloat(item.quantity);

//       const material = matId ? await Material.findByPk(matId, { transaction }) : null;
//       const efValue = parseSafeFloat(material?.emission_factor || 1);
      
//       const itemCarbon = item.carbon_footprint !== undefined && !isNaN(parseFloat(item.carbon_footprint))
//         ? parseSafeFloat(item.carbon_footprint)
//         : qty * efValue;

//       totalCarbonSum += itemCarbon;

//       // บันทึกลง activity_details
//       await ActivityDetail.create({
//         activity_id: activity.id,
//         scope_id: scopeId,
//         category_id: catId,
//         activity_type_id: actTypeId,
//         material_id: matId,
//         quantity: qty,
//         unit: item.unit || material?.default_unit || "unit",
//         carbon_footprint: itemCarbon
//       }, { transaction });

//       // บันทึกลง carbon_calculations (ถ้ามี)
//       if (CarbonCalculation) {
//         try {
//           await CarbonCalculation.create({
//             activity_id: activity.id,
//             material_id: matId,
//             quantity: qty,
//             factor_value: efValue,
//             total_co2e: itemCarbon,
//             calculation_type: "EMISSION",
//             calculation_method: "ACTIVITY_BASED"
//           }, { transaction });
//         } catch (calcErr) {
//           console.warn("⚠️ Warning: Could not create CarbonCalculation record:", calcErr.message);
//         }
//       }
//     }

//     await transaction.commit();

//     return res.status(201).json({
//       success: true,
//       message: "บันทึกกิจกรรมเรียบร้อยแล้ว",
//       data: { activity, total_co2e: totalCarbonSum }
//     });

//   } catch (error) {
//     await transaction.rollback();
//     console.error("❌ CREATE ACTIVITY ERROR DETAILS:", error);
//     return res.status(500).json({ 
//       success: false, 
//       message: `เกิดข้อผิดพลาดในการบันทึก: ${error.message || "Internal Server Error"}`,
//       sqlMessage: error.original?.sqlMessage || null
//     });
//   }
// };

// // ========================================
// // GET /api/activities/:id
// // Get activity by ID
// // ========================================

// const getActivityById = async (req, res) => {

//     try {

//         const { id } = req.params;

//         const activity = await Activity.findByPk(id, {

//             include: [
//                 {
//                     model: CarbonCalculation,
//                     as: "calculations",

//                     attributes: [
//                         "id",
//                         "emission_factor_id",
//                         "quantity",
//                         "factor_value",
//                         "co2_result",
//                         "ch4_result",
//                         "n2o_result",
//                         "total_co2e",
//                         "calculation_type",
//                         "calculation_method",
//                         "calculated_at"
//                     ]
//                 }
//             ]

//         });

//         if (!activity) {

//             return res.status(404).json({

//                 success: false,

//                 message: "ไม่พบ Activity ที่ต้องการ"

//             });

//         }

//         return res.status(200).json({

//             success: true,

//             data: activity

//         });

//     } catch (error) {

//         console.error(
//             "Get activity error:",
//             error
//         );

//         return res.status(500).json({

//             success: false,

//             message: "ไม่สามารถดึงข้อมูล Activity ได้",

//             error: error.message

//         });

//     }

// };

// // const deleteActivity = async (req, res) => {
// //     const transaction = await sequelize.transaction();
// //     try {
// //         const { id } = req.params;
// //         const userRole = req.user.role?.name || req.user.role; // เช็คบทบาทผู้ใช้งาน

// //         // 🛑 เช็คสิทธิ์: หากไม่ใช่ ADMIN ห้ามลบ
// //         if (String(userRole).toUpperCase() !== 'ADMIN') {
// //             await transaction.rollback();
// //             return res.status(403).json({
// //                 success: false,
// //                 message: "คุณไม่มีสิทธิ์ลบกิจกรรมนี้ (เฉพาะ Admin เท่านั้น)"
// //             });
// //         }

// //         // ค้นหากิจกรรม
// //         const activity = await Activity.findByPk(id);
// //         if (!activity) {
// //             await transaction.rollback();
// //             return res.status(404).json({
// //                 success: false,
// //                 message: "ไม่พบกิจกรรมที่ต้องการลบ"
// //             });
// //         }

// //         // ลบข้อมูลคำนวณ Carbon ที่เกี่ยวข้องก่อน (ถ้าไม่มี Cascade Delete ใน DB)
// //         await CarbonCalculation.destroy({
// //             where: { activity_id: id },
// //             transaction
// //         });

// //         // ลบ ตัว Activity
// //         await activity.destroy({ transaction });

// //         await transaction.commit();

// //         return res.status(200).json({
// //             success: true,
// //             message: "ลบกิจกรรมเรียบร้อยแล้ว"
// //         });

// //     } catch (error) {
// //         await transaction.rollback();
// //         console.error("Delete activity error:", error);
// //         return res.status(500).json({
// //             success: false,
// //             message: "เกิดข้อผิดพลาดในการลบกิจกรรม",
// //             error: error.message
// //         });
// //     }
// // };

// const deleteActivity = async (req, res) => {
//     // 1. ตรวจเช็กสิทธิ์เบื้องต้นก่อนเปิด Transaction (เพื่อประหยัดทรัพยากร DB)
//     const userRole = req.user?.role?.name || req.user?.role;
//     if (String(userRole).toUpperCase() !== 'ADMIN') {
//         return res.status(403).json({
//             success: false,
//             message: "คุณไม่มีสิทธิ์ลบกิจกรรมนี้ (เฉพาะ Admin เท่านั้น)"
//         });
//     }

//     const transaction = await sequelize.transaction();

//     try {
//         const { id } = req.params;

//         // 2. ค้นหากิจกรรมโดยผูกกับ transaction
//         const activity = await Activity.findByPk(id, { transaction });
//         if (!activity) {
//             await transaction.rollback();
//             return res.status(404).json({
//                 success: false,
//                 message: "ไม่พบกิจกรรมที่ต้องการลบ"
//             });
//         }

//         // 3. ลบไฟล์หลักฐานประกอบ (ถ้ามีตาราง evidence_files)
//         if (typeof EvidenceFile !== 'undefined') {
//             await EvidenceFile.destroy({
//                 where: { activity_id: id },
//                 transaction
//             });
//         }

//         // 4. ลบข้อมูลคำนวณ Carbon ที่เกี่ยวข้อง
//         await CarbonCalculation.destroy({
//             where: { activity_id: id },
//             transaction
//         });

//         // 5. ลบตัว Activity
//         await activity.destroy({ transaction });

//         // Commit การทำงานทั้งหมด
//         await transaction.commit();

//         return res.status(200).json({
//             success: true,
//             message: "ลบกิจกรรมเรียบร้อยแล้ว"
//         });

//     } catch (error) {
//         await transaction.rollback();
//         console.error("Delete activity error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "เกิดข้อผิดพลาดในการลบกิจกรรม",
//             error: error.message
//         });
//     }
// };

// // const updateActivity = async (req, res) => {

// //     const transaction = await sequelize.transaction();

// //     try {

// //         const { id } = req.params;

// //         const {
            
// //             scope_id,
// //             category_id,
// //             activity_type_id,
// //             material_id,
// //             supplier_id,
// //             activity_date,
// //             quantity,
// //             unit,
// //             description,
// //             data_source
// //         } = req.body || {};
// //         const user_id = req.user.id;

// //         // ========================================
// //         // Find Activity
// //         // ========================================

// //         const activity = await Activity.findByPk(id, {
// //             transaction
// //         });

// //         if (!activity) {

// //             await transaction.rollback();

// //             return res.status(404).json({
// //                 success: false,
// //                 message: "ไม่พบ Activity ที่ต้องการแก้ไข"
// //             });

// //         }


// //         // ========================================
// //         // Validate Required Fields
// //         // ========================================

       

// //         if (!scope_id) {
// //             await transaction.rollback();

// //             return res.status(400).json({
// //                 success: false,
// //                 message: "กรุณาระบุ scope_id"
// //             });
// //         }

// //         if (!category_id) {
// //             await transaction.rollback();

// //             return res.status(400).json({
// //                 success: false,
// //                 message: "กรุณาระบุ category_id"
// //             });
// //         }

// //         if (!activity_type_id) {
// //             await transaction.rollback();

// //             return res.status(400).json({
// //                 success: false,
// //                 message: "กรุณาระบุ activity_type_id"
// //             });
// //         }

// //         if (!material_id) {
// //             await transaction.rollback();

// //             return res.status(400).json({
// //                 success: false,
// //                 message: "กรุณาระบุ material_id"
// //             });
// //         }

// //         if (!activity_date) {
// //             await transaction.rollback();

// //             return res.status(400).json({
// //                 success: false,
// //                 message: "กรุณาระบุ activity_date"
// //             });
// //         }

// //         if (quantity === undefined || quantity === null) {
// //             await transaction.rollback();

// //             return res.status(400).json({
// //                 success: false,
// //                 message: "กรุณาระบุ quantity"
// //             });
// //         }

// //         if (isNaN(Number(quantity))) {
// //             await transaction.rollback();

// //             return res.status(400).json({
// //                 success: false,
// //                 message: "quantity ต้องเป็นตัวเลข"
// //             });
// //         }

// //         if (Number(quantity) < 0) {
// //             await transaction.rollback();

// //             return res.status(400).json({
// //                 success: false,
// //                 message: "quantity ต้องไม่ติดลบ"
// //             });
// //         }

// //         if (!unit) {
// //             await transaction.rollback();

// //             return res.status(400).json({
// //                 success: false,
// //                 message: "กรุณาระบุ unit"
// //             });
// //         }


// //         // ========================================
// //         // Find Active Emission Factor
// //         // ========================================

// //         const emissionFactor = await EmissionFactor.findOne({

// //             where: {
// //                 material_id: material_id,
// //                 status: "ACTIVE"
// //             },

// //             order: [
// //                 ["priority", "ASC"],
// //                 ["id", "DESC"]
// //             ],

// //             transaction

// //         });


// //         if (!emissionFactor) {

// //             await transaction.rollback();

// //             return res.status(404).json({
// //                 success: false,
// //                 message: "ไม่พบ Emission Factor ที่ใช้งานสำหรับ Material นี้"
// //             });

// //         }


// //         // ========================================
// //         // Check Unit
// //         // ========================================

// //         if (
// //             emissionFactor.unit &&
// //             unit !== emissionFactor.unit
// //         ) {

// //             await transaction.rollback();

// //             return res.status(400).json({

// //                 success: false,

// //                 message: "หน่วยของ Activity ไม่ตรงกับ Emission Factor",

// //                 data: {
// //                     input_unit: unit,
// //                     emission_factor_unit: emissionFactor.unit
// //                 }

// //             });

// //         }


// //         // ========================================
// //         // Calculate Carbon Footprint
// //         // ========================================

// //         const calculation = calculateCarbonFootprint({

// //             quantity: Number(quantity),

// //             emissionFactor: emissionFactor

// //         });


// //         // ========================================
// //         // Update Activity
// //         // ========================================

// //         await activity.update({

// //             user_id,
// //             scope_id,
// //             category_id,
// //             activity_type_id,
// //             material_id,
// //             supplier_id: supplier_id || null,
// //             activity_date,
// //             quantity: Number(quantity),
// //             unit,
// //             description: description || null,
// //             data_source: data_source || "OTHER"

// //         }, {
// //             transaction
// //         });


// //         // ========================================
// //         // Find Existing Carbon Calculation
// //         // ========================================

// //         let carbonCalculation = await CarbonCalculation.findOne({

// //             where: {
// //                 activity_id: activity.id
// //             },

// //             order: [
// //                 ["id", "DESC"]
// //             ],

// //             transaction

// //         });


// //         // ========================================
// //         // Update Existing Calculation
// //         // ========================================

// //         if (carbonCalculation) {

// //             await carbonCalculation.update({

// //                 emission_factor_id: emissionFactor.id,

// //                 quantity: Number(quantity),

// //                 factor_value: calculation.emission_factor,

// //                 co2_result: 0,

// //                 ch4_result: 0,

// //                 n2o_result: 0,

// //                 total_co2e: calculation.total_co2e,

// //                 calculation_type: "EMISSION",

// //                 calculation_method: "ACTIVITY_BASED"

// //             }, {
// //                 transaction
// //             });

// //         }

// //         // ========================================
// //         // Create Calculation if None Exists
// //         // ========================================

// //         else {

// //             carbonCalculation =
// //                 await CarbonCalculation.create({

// //                     activity_id: activity.id,

// //                     emission_factor_id: emissionFactor.id,

// //                     quantity: Number(quantity),

// //                     factor_value: calculation.emission_factor,

// //                     co2_result: 0,

// //                     ch4_result: 0,

// //                     n2o_result: 0,

// //                     total_co2e: calculation.total_co2e,

// //                     calculation_type: "EMISSION",

// //                     calculation_method: "ACTIVITY_BASED"

// //                 }, {
// //                     transaction
// //                 });

// //         }


// //         // ========================================
// //         // Commit Transaction
// //         // ========================================

// //         await transaction.commit();


// //         // ========================================
// //         // Response
// //         // ========================================

// //         return res.status(200).json({

// //             success: true,

// //             message: "แก้ไข Activity และคำนวณ Carbon Footprint สำเร็จ",

// //             data: {

// //                 activity: {

// //                     id: activity.id,

// //                     user_id: activity.user_id,

// //                     scope_id: activity.scope_id,

// //                     category_id: activity.category_id,

// //                     activity_type_id: activity.activity_type_id,

// //                     material_id: activity.material_id,

// //                     supplier_id: activity.supplier_id,

// //                     activity_date: activity.activity_date,

// //                     quantity: activity.quantity,

// //                     unit: activity.unit,

// //                     description: activity.description,

// //                     data_source: activity.data_source,

// //                     status: activity.status

// //                 },

// //                 calculation: {

// //                     id: carbonCalculation.id,

// //                     emission_factor_id: emissionFactor.id,

// //                     emission_factor:
// //                         calculation.emission_factor,

// //                     quantity:
// //                         calculation.quantity,

// //                     total_co2e:
// //                         calculation.total_co2e,

// //                     co2e_unit: "kgCO2e",

// //                     calculation_type: "EMISSION",

// //                     calculation_method: "ACTIVITY_BASED"

// //                 }

// //             }

// //         });

// //     } catch (error) {

// //         await transaction.rollback();

// //         console.error(
// //             "Update activity error:",
// //             error
// //         );

// //         return res.status(500).json({

// //             success: false,

// //             message: "ไม่สามารถแก้ไข Activity ได้",

// //             error: error.message

// //         });

// //     }

// // };

// // const updateActivity = async (req, res) => {
// //     const transaction = await sequelize.transaction();

// //     try {
// //         const { id } = req.params;

// //         const {
// //             scope_id,
// //             category_id,
// //             activity_type_id,
// //             material_id,
// //             supplier_id,
// //             activity_date,
// //             quantity,
// //             unit,
// //             description,
// //             data_source
// //         } = req.body || {};
// //         const user_id = req.user.id;

// //         // ========================================
// //         // 1. Find Activity
// //         // ========================================
// //         const activity = await Activity.findByPk(id, { transaction });

// //         if (!activity) {
// //             await transaction.rollback();
// //             return res.status(404).json({
// //                 success: false,
// //                 message: "ไม่พบ Activity ที่ต้องการแก้ไข"
// //             });
// //         }

// //         // ========================================
// //         // 2. Fallback values (แก้เรื่อง Full Payload)
// //         // หากฝั่ง Frontend ไม่ได้ส่งฟิลด์ไหนมา ให้ใช้ค่าเดิมจาก Database
// //         // ========================================
// //         const final_scope_id = scope_id || activity.scope_id;
// //         const final_category_id = category_id || activity.category_id;
// //         const final_activity_type_id = activity_type_id || activity.activity_type_id;
// //         const final_material_id = material_id || activity.material_id;
// //         const final_activity_date = activity_date || activity.activity_date;
// //         const final_quantity = (quantity !== undefined && quantity !== null) ? quantity : activity.quantity;
// //         const final_unit = unit || activity.unit;

// //         // Validation ข้อมูลที่จำเป็น
// //         if (isNaN(Number(final_quantity))) {
// //             await transaction.rollback();
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "quantity ต้องเป็นตัวเลข"
// //             });
// //         }

// //         if (Number(final_quantity) < 0) {
// //             await transaction.rollback();
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "quantity ต้องไม่ติดลบ"
// //             });
// //         }

// //         // ========================================
// //         // 3. Find Active Emission Factor
// //         // ========================================
// //         const emissionFactor = await EmissionFactor.findOne({
// //             where: {
// //                 material_id: final_material_id,
// //                 status: "ACTIVE"
// //             },
// //             order: [
// //                 ["priority", "ASC"],
// //                 ["id", "DESC"]
// //             ],
// //             transaction
// //         });

// //         if (!emissionFactor) {
// //             await transaction.rollback();
// //             return res.status(404).json({
// //                 success: false,
// //                 message: "ไม่พบ Emission Factor ที่ใช้งานสำหรับ Material นี้"
// //             });
// //         }

// //         // ========================================
// //         // 4. Check Unit (แก้เรื่อง Case/Space Sensitivity)
// //         // ========================================
// //         if (
// //             emissionFactor.unit &&
// //             final_unit.trim().toLowerCase() !== emissionFactor.unit.trim().toLowerCase()
// //         ) {
// //             await transaction.rollback();
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "หน่วยของ Activity ไม่ตรงกับ Emission Factor",
// //                 data: {
// //                     input_unit: final_unit,
// //                     emission_factor_unit: emissionFactor.unit
// //                 }
// //             });
// //         }

// //         // ========================================
// //         // 5. Calculate Carbon Footprint
// //         // ========================================
// //         const calculation = calculateCarbonFootprint({
// //             quantity: Number(final_quantity),
// //             emissionFactor: emissionFactor
// //         });

// //         // ========================================
// //         // 6. Update Activity
// //         // ========================================
// //         await activity.update({
// //             user_id,
// //             scope_id: final_scope_id,
// //             category_id: final_category_id,
// //             activity_type_id: final_activity_type_id,
// //             material_id: final_material_id,
// //             supplier_id: supplier_id !== undefined ? supplier_id : activity.supplier_id,
// //             activity_date: final_activity_date,
// //             quantity: Number(final_quantity),
// //             unit: final_unit,
// //             description: description !== undefined ? description : activity.description,
// //             data_source: data_source || activity.data_source || "OTHER"
// //         }, { transaction });

// //         // ========================================
// //         // 7. Find & Update Existing Carbon Calculation
// //         // ========================================
// //         let carbonCalculation = await CarbonCalculation.findOne({
// //             where: { activity_id: activity.id },
// //             order: [["id", "DESC"]],
// //             transaction
// //         });

// //         if (carbonCalculation) {
// //             await carbonCalculation.update({
// //                 emission_factor_id: emissionFactor.id,
// //                 quantity: Number(final_quantity),
// //                 factor_value: calculation.emission_factor,
// //                 co2_result: 0,
// //                 ch4_result: 0,
// //                 n2o_result: 0,
// //                 total_co2e: calculation.total_co2e,
// //                 calculation_type: "EMISSION",
// //                 calculation_method: "ACTIVITY_BASED"
// //             }, { transaction });
// //         } else {
// //             carbonCalculation = await CarbonCalculation.create({
// //                 activity_id: activity.id,
// //                 emission_factor_id: emissionFactor.id,
// //                 quantity: Number(final_quantity),
// //                 factor_value: calculation.emission_factor,
// //                 co2_result: 0,
// //                 ch4_result: 0,
// //                 n2o_result: 0,
// //                 total_co2e: calculation.total_co2e,
// //                 calculation_type: "EMISSION",
// //                 calculation_method: "ACTIVITY_BASED"
// //             }, { transaction });
// //         }

// //         await transaction.commit();

// //         return res.status(200).json({
// //             success: true,
// //             message: "แก้ไข Activity และคำนวณ Carbon Footprint สำเร็จ",
// //             data: {
// //                 activity,
// //                 calculation: {
// //                     id: carbonCalculation.id,
// //                     emission_factor_id: emissionFactor.id,
// //                     emission_factor: calculation.emission_factor,
// //                     quantity: calculation.quantity,
// //                     total_co2e: calculation.total_co2e,
// //                     co2e_unit: "kgCO2e",
// //                     calculation_type: "EMISSION",
// //                     calculation_method: "ACTIVITY_BASED"
// //                 }
// //             }
// //         });

// //     } catch (error) {
// //         await transaction.rollback();
// //         console.error("Update activity error:", error);
// //         return res.status(500).json({
// //             success: false,
// //             message: "ไม่สามารถแก้ไข Activity ได้",
// //             error: error.message
// //         });
// //     }
// // };

// const updateActivity = async (req, res) => {
//     const transaction = await sequelize.transaction();

//     try {
//         const { id } = req.params;
//         const user_id = req.user.id;
//         const userRole = String(req.user?.role?.name || req.user?.role || '').toUpperCase();

//         const {
//             name,
//             scope_id,
//             category_id,
//             activity_type_id,
//             material_id,
//             supplier_id,
//             activity_date,
//             quantity,
//             unit,
//             description,
//             data_source
//         } = req.body || {};

//         // ========================================
//         // 1. Find Activity & Check RBAC Permission
//         // ========================================
//         const activity = await Activity.findByPk(id, { transaction });

//         if (!activity) {
//             await transaction.rollback();
//             return res.status(404).json({
//                 success: false,
//                 message: "ไม่พบ Activity ที่ต้องการแก้ไข"
//             });
//         }

//         // เช็กสิทธิ์: หากไม่ใช่ ADMIN/MANAGER และไม่ใช่เจ้าของรายการ จะไม่มีสิทธิ์แก้ไข
//         if (userRole !== 'ADMIN' && userRole !== 'MANAGER' && activity.user_id !== user_id) {
//             await transaction.rollback();
//             return res.status(403).json({
//                 success: false,
//                 message: "คุณไม่มีสิทธิ์แก้ไขกิจกรรมนี้"
//             });
//         }

//         // ========================================
//         // 2. Fallback values
//         // ========================================
//         const final_scope_id = scope_id || activity.scope_id;
//         const final_category_id = category_id || activity.category_id;
//         const final_activity_type_id = activity_type_id || activity.activity_type_id;
//         const final_material_id = material_id || activity.material_id;
//         const final_activity_date = activity_date || activity.activity_date;
//         const final_quantity = (quantity !== undefined && quantity !== null) ? quantity : activity.quantity;
//         const final_unit = unit || activity.unit;

//         // Validation ข้อมูลตัวเลข
//         if (isNaN(Number(final_quantity))) {
//             await transaction.rollback();
//             return res.status(400).json({
//                 success: false,
//                 message: "quantity ต้องเป็นตัวเลข"
//             });
//         }

//         if (Number(final_quantity) < 0) {
//             await transaction.rollback();
//             return res.status(400).json({
//                 success: false,
//                 message: "quantity ต้องไม่ติดลบ"
//             });
//         }

//         // ========================================
//         // 3. Find Active Emission Factor
//         // ========================================
//         const emissionFactor = await EmissionFactor.findOne({
//             where: {
//                 material_id: final_material_id,
//                 status: "ACTIVE"
//             },
//             order: [
//                 ["priority", "ASC"],
//                 ["id", "DESC"]
//             ],
//             transaction
//         });

//         if (!emissionFactor) {
//             await transaction.rollback();
//             return res.status(404).json({
//                 success: false,
//                 message: "ไม่พบ Emission Factor ที่ใช้งานสำหรับ Material นี้"
//             });
//         }

//         // ========================================
//         // 4. Check Unit (Case/Space Sensitivity)
//         // ========================================
//         if (
//             emissionFactor.unit &&
//             final_unit.trim().toLowerCase() !== emissionFactor.unit.trim().toLowerCase()
//         ) {
//             await transaction.rollback();
//             return res.status(400).json({
//                 success: false,
//                 message: "หน่วยของ Activity ไม่ตรงกับ Emission Factor",
//                 data: {
//                     input_unit: final_unit,
//                     emission_factor_unit: emissionFactor.unit
//                 }
//             });
//         }

//         // ========================================
//         // 5. Calculate Carbon Footprint
//         // ========================================
//         const calculation = calculateCarbonFootprint({
//             quantity: Number(final_quantity),
//             emissionFactor: emissionFactor
//         });

//         // ========================================
//         // 6. Update Activity (ตัด user_id ออกเพื่อคงผู้สร้างเดิมไว้)
//         // ========================================
//         await activity.update({
//             name: name !== undefined ? name.trim() : activity.name,
//             scope_id: final_scope_id,
//             category_id: final_category_id,
//             activity_type_id: final_activity_type_id,
//             material_id: final_material_id,
//             supplier_id: supplier_id !== undefined ? supplier_id : activity.supplier_id,
//             activity_date: final_activity_date,
//             quantity: Number(final_quantity),
//             unit: final_unit,
//             description: description !== undefined ? description : activity.description,
//             data_source: data_source || activity.data_source || "OTHER"
//         }, { transaction });

//         // ========================================
//         // 7. Find & Update Existing Carbon Calculation
//         // ========================================
//         let carbonCalculation = await CarbonCalculation.findOne({
//             where: { activity_id: activity.id },
//             order: [["id", "DESC"]],
//             transaction
//         });

//         const calcData = {
//             emission_factor_id: emissionFactor.id,
//             quantity: Number(final_quantity),
//             factor_value: calculation.emission_factor,
//             co2_result: 0,
//             ch4_result: 0,
//             n2o_result: 0,
//             total_co2e: calculation.total_co2e,
//             calculation_type: "EMISSION",
//             calculation_method: "ACTIVITY_BASED"
//         };

//         if (carbonCalculation) {
//             await carbonCalculation.update(calcData, { transaction });
//         } else {
//             carbonCalculation = await CarbonCalculation.create({
//                 activity_id: activity.id,
//                 ...calcData
//             }, { transaction });
//         }

//         await transaction.commit();

//         return res.status(200).json({
//             success: true,
//             message: "แก้ไข Activity และคำนวณ Carbon Footprint สำเร็จ",
//             data: {
//                 activity,
//                 calculation: {
//                     id: carbonCalculation.id,
//                     emission_factor_id: emissionFactor.id,
//                     emission_factor: calculation.emission_factor,
//                     quantity: calculation.quantity,
//                     total_co2e: calculation.total_co2e,
//                     co2e_unit: "kgCO2e",
//                     calculation_type: "EMISSION",
//                     calculation_method: "ACTIVITY_BASED"
//                 }
//             }
//         });

//     } catch (error) {
//         await transaction.rollback();
//         console.error("Update activity error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "ไม่สามารถแก้ไข Activity ได้",
//             error: error.message
//         });
//     }
// };

// module.exports = {
//     createActivity,
//     getActivities,
//     getActivityById,
//     deleteActivity,
//     updateActivity
// };


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
      const scopeList = [...new Set(details.map(d => d.scope_id).filter(Boolean))].sort();

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
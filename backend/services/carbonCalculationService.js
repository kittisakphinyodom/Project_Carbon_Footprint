// const { Op } = require("sequelize");

// const CarbonCalculation = require("../models/CarbonCalculation");
// const Activity = require("../models/Activity");
// const Scope = require("../models/Scope");
// const ScopeCategory = require("../models/ScopeCategory");
// const Material = require("../models/Material");

// // Map ชื่อหมวดหมู่ภาษาไทยสำรอง
// const CATEGORY_NAMES = {
//   1: "การเผาไหม้แบบอยู่กับที่ (Stationary Combustion)",
//   2: "การเผาไหม้ที่มีการเคลื่อนที่ (Mobile Combustion)",
//   3: "สารทำความเย็น / รั่วไหล (Fugitive Emissions)",
//   4: "กระบวนการผลิต (Process Emissions)",
//   5: "พลังงาน/ไอน้ำ/ไฟฟ้า ที่ซื้อมาใช้งาน (Purchased Energy & Steam)",
//   6: "การเดินทางของพนักงาน (Business Travel)",
//   7: "การขนส่งวัตถุดิบ/สินค้า (Upstream Transportation)",
//   8: "ของเสียจากการดำเนินงาน (Waste Generated in Operations)",
//   9: "การใช้น้ำประปา (Water Supply & Wastewater)",
//   10: "ขยะอินทรีย์และอาหารเหลือทิ้ง (Food Waste & Organic Waste)"
// };

// const calculateCarbonFootprint = ({ quantity, emissionFactor }) => {
//     if (quantity === undefined || quantity === null) throw new Error("กรุณาระบุปริมาณกิจกรรม");
//     if (quantity < 0) throw new Error("ปริมาณกิจกรรมต้องไม่ติดลบ");
//     if (!emissionFactor) throw new Error("ไม่พบ Emission Factor");

//     const ef = Number(emissionFactor.total_co2e_factor || emissionFactor);
//     if (isNaN(ef)) throw new Error("ค่า Emission Factor ไม่ถูกต้อง");

//     const activityQuantity = Number(quantity);
//     const totalCO2e = activityQuantity * ef;

//     return {
//         quantity: activityQuantity,
//         emission_factor: ef,
//         total_co2e: Number(totalCO2e.toFixed(6))
//     };
// };

// // ========================================
// // Get Carbon Summary (Safety Implementation)
// // ========================================

// const getCarbonSummary = async ({ userId, startDate, endDate }) => {

//     // 1. เงื่อนไขกรองกิจกรรมตาม User ID และ วันที่
//     const activityWhere = {};
//     if (userId) {
//         activityWhere.user_id = userId;
//     }

//     if (startDate && endDate) {
//         activityWhere.activity_date = { [Op.between]: [startDate, endDate] };
//     } else if (startDate) {
//         activityWhere.activity_date = { [Op.gte]: startDate };
//     } else if (endDate) {
//         activityWhere.activity_date = { [Op.lte]: endDate };
//     }

//     // 2. ดึงข้อมูล Master Data มาเตรียมไว้ (ป้องกัน Join Error)
//     const [scopesList, categoriesList, materialsList] = await Promise.all([
//         Scope.findAll({ raw: true }).catch(() => []),
//         ScopeCategory.findAll({ raw: true }).catch(() => []),
//         Material.findAll({ raw: true }).catch(() => [])
//     ]);

//     const scopeMap = {};
//     scopesList.forEach(s => { scopeMap[s.id] = s; });

//     const categoryMap = {};
//     categoriesList.forEach(c => { categoryMap[c.id] = c; });

//     const materialMap = {};
//     materialsList.forEach(m => {
//         if (m.id !== undefined && m.id !== null) {
//             materialMap[m.id] = m;
//             materialMap[String(m.id)] = m;
//         }
//     });

//     // 3. ดึงจำนวนกิจกรรมทั้งหมดที่ตรงเงื่อนไข
//     const totalActivities = await Activity.count({
//         where: activityWhere
//     }).catch(() => 0);

//     // 4. ดึงข้อมูลคำนวณร่วมกับกิจกรรม
//     const calculations = await CarbonCalculation.findAll({
//         include: [
//             {
//                 model: Activity,
//                 as: "activity",
//                 where: activityWhere,
//                 required: true
//             }
//         ],
//         raw: true
//     }).catch(err => {
//         console.error("Fetch Calculations Error:", err);
//         return [];
//     });

//     // 5. สรุปผลรวมคาร์บอนใน Memory (แก้ปัญหา Scope 2 หลุดอย่างสมบูรณ์)
//     let grandTotalCO2e = 0;
//     const scopeAgg = {};
//     const categoryAgg = {};
//     const materialAgg = {};

//     calculations.forEach(calc => {
//         const co2 = parseFloat(calc.total_co2e || 0);
//         grandTotalCO2e += co2;

//         const actScopeId = calc["activity.scope_id"] || calc.scope_id;
//         const actCatId = calc["activity.category_id"] || calc.category_id;
//         const actMatId = calc["activity.material_id"] || calc.material_id;

//         const matObj = materialMap[actMatId];

//         // 🟢 ดึง Scope ID: ถ้า Activity ไม่มี ให้ดึงจาก Material.scope_id แทน (แก้ปัญหา Scope 2 หาย)
//         const scopeId = actScopeId || matObj?.scope_id || 1;
//         const categoryId = actCatId || matObj?.category_id || 1;
//         const materialId = actMatId || 0;

//         if (scopeId) scopeAgg[scopeId] = (scopeAgg[scopeId] || 0) + co2;
//         if (categoryId) categoryAgg[categoryId] = (categoryAgg[categoryId] || 0) + co2;
//         if (materialId) materialAgg[materialId] = (materialAgg[materialId] || 0) + co2;
//     });

//     // 6. Format ผลลัพธ์กลับไปแสดงผล
//     const formattedScopeSummary = Object.keys(scopeAgg).map(sId => {
//         const idNum = Number(sId);
//         const sObj = scopeMap[idNum];
//         return {
//             scope_id: idNum,
//             scope_code: sObj?.code || `SCOPE_${idNum}`,
//             scope_name: sObj?.name || (idNum === 2 ? "Scope 2 : Indirect Energy Emissions" : `Scope ${idNum}`),
//             total_co2e: Number(scopeAgg[sId].toFixed(6))
//         };
//     }).sort((a, b) => a.scope_id - b.scope_id);

//     const formattedCategorySummary = Object.keys(categoryAgg).map(cId => {
//         const idNum = Number(cId);
//         const cObj = categoryMap[idNum];
//         return {
//             category_id: idNum,
//             category_code: cObj?.code || `CAT_${idNum}`,
//             category_name: cObj?.name || CATEGORY_NAMES[idNum] || `Category ${idNum}`,
//             total_co2e: Number(categoryAgg[cId].toFixed(6))
//         };
//     }).sort((a, b) => b.total_co2e - a.total_co2e);

//     const formattedMaterialSummary = Object.keys(materialAgg).map(mId => {
//         const idNum = Number(mId);
//         const mObj = materialMap[mId] || materialMap[idNum];
//         return {
//             material_id: idNum,
//             material_code: mObj?.code || null,
//             material_name: mObj?.name || mObj?.material_name || (idNum ? `Material #${idNum}` : "ไม่ระบุวัตถุดิบ"),
//             unit: mObj?.default_unit || mObj?.unit || '',
//             total_co2e: Number(materialAgg[mId].toFixed(6))
//         };
//     }).sort((a, b) => b.total_co2e - a.total_co2e);

//     return {
//         total_co2e: Number(grandTotalCO2e.toFixed(6)),
//         total_activities: totalActivities,
//         start_date: startDate || null,
//         end_date: endDate || null,
//         scope_summary: formattedScopeSummary,
//         category_summary: formattedCategorySummary,
//         material_summary: formattedMaterialSummary
//     };
// };

// module.exports = {
//     calculateCarbonFootprint,
//     getCarbonSummary
// };
//2222222222222222222222222222222222222222222222222222222
// const { Op } = require("sequelize");

// const CarbonCalculation = require("../models/CarbonCalculation");
// const Activity = require("../models/Activity");
// const Scope = require("../models/Scope");
// const ScopeCategory = require("../models/ScopeCategory");
// const Material = require("../models/Material");

// // Map ชื่อหมวดหมู่ประเภทกิจกรรมภาษาไทย (สำรอง)
// const CATEGORY_NAMES = {
//   1: "การเผาไหม้แบบอยู่กับที่ (Stationary Combustion)",
//   2: "การเผาไหม้ที่มีการเคลื่อนที่ (Mobile Combustion)",
//   3: "สารทำความเย็น / รั่วไหล (Fugitive Emissions)",
//   4: "กระบวนการผลิต (Process Emissions)",
//   5: "พลังงาน/ไอน้ำ/ไฟฟ้า ที่ซื้อมาใช้งาน (Purchased Energy & Steam)",
//   6: "การเดินทางของพนักงาน (Business Travel)",
//   7: "การขนส่งวัตถุดิบ/สินค้า (Upstream Transportation)",
//   8: "ของเสียจากการดำเนินงาน (Waste Generated in Operations)",
//   9: "การใช้น้ำประปา (Water Supply & Wastewater)",
//   10: "ขยะอินทรีย์และอาหารเหลือทิ้ง (Food Waste & Organic Waste)"
// };

// const calculateCarbonFootprint = ({ quantity, emissionFactor }) => {
//     if (quantity === undefined || quantity === null) throw new Error("กรุณาระบุปริมาณกิจกรรม");
//     if (quantity < 0) throw new Error("ปริมาณกิจกรรมต้องไม่ติดลบ");
//     if (!emissionFactor) throw new Error("ไม่พบ Emission Factor");

//     const ef = Number(emissionFactor.total_co2e_factor || emissionFactor);
//     if (isNaN(ef)) throw new Error("ค่า Emission Factor ไม่ถูกต้อง");

//     const activityQuantity = Number(quantity);
//     const totalCO2e = activityQuantity * ef;

//     return {
//         quantity: activityQuantity,
//         emission_factor: ef,
//         total_co2e: Number(totalCO2e.toFixed(6))
//     };
// };

// // ========================================
// // Get Carbon Summary (Robust Material Mapping)
// // ========================================

// const getCarbonSummary = async ({ userId, startDate, endDate }) => {

//     const activityWhere = {};
//     if (userId) {
//         activityWhere.user_id = userId;
//     }

//     if (startDate && endDate) {
//         activityWhere.activity_date = { [Op.between]: [startDate, endDate] };
//     } else if (startDate) {
//         activityWhere.activity_date = { [Op.gte]: startDate };
//     } else if (endDate) {
//         activityWhere.activity_date = { [Op.lte]: endDate };
//     }

//     // 1. ดึงข้อมูล Master Data อย่างปลอดภัย
//     let scopesList = [];
//     let categoriesList = [];
//     let materialsList = [];

//     try { scopesList = await Scope.findAll({ raw: true }); } catch (e) { console.error("Fetch Scope Error:", e.message); }
//     try { categoriesList = await ScopeCategory.findAll({ raw: true }); } catch (e) { console.error("Fetch ScopeCategory Error:", e.message); }
//     try { 
//         materialsList = await Material.findAll({ 
//             attributes: ['id', 'name', 'scope_id', 'category_id', 'default_unit'],
//             raw: true 
//         }); 
//     } catch (e) { 
//         console.error("Fetch Material Attempt 1 Error:", e.message);
//         // 🛡️ สำรองกรณีฟิลด์ scope_id หรือ default_unit ใน DB ใช้ชื่ออื่น ให้ดึงเฉพาะ id และ name
//         try {
//             materialsList = await Material.findAll({
//                 attributes: ['id', 'name'],
//                 raw: true
//             });
//         } catch (e2) {
//             console.error("Fetch Material Attempt 2 Error:", e2.message);
//         }
//     }

//     // ทำ Map โดยรองรับทั้ง id และ material_id
//     const scopeMap = {};
//     scopesList.forEach(s => {
//         const key = s.id !== undefined ? s.id : s.scope_id;
//         if (key !== undefined) scopeMap[key] = s;
//     });

//     const categoryMap = {};
//     categoriesList.forEach(c => {
//         const key = c.id !== undefined ? c.id : c.category_id;
//         if (key !== undefined) categoryMap[key] = c;
//     });

//     // 🟢 สร้าง Map วัสดุโดยดึงทุกรูปแบบชื่อ Key ใน DB
//     const materialMap = {};
//     materialsList.forEach(m => {
//         const key = m.id !== undefined ? m.id : m.material_id;
//         if (key !== undefined && key !== null) {
//             materialMap[key] = m;
//             materialMap[String(key)] = m;
//         }
//     });

//     // 2. ดึงจำนวนกิจกรรมทั้งหมด
//     const totalActivities = await Activity.count({
//         where: activityWhere
//     }).catch(() => 0);

//     // 3. ดึงรายการคำนวณทั้งหมด
//     const calculations = await CarbonCalculation.findAll({
//         include: [
//             {
//                 model: Activity,
//                 as: "activity",
//                 where: activityWhere,
//                 required: true
//             }
//         ],
//         raw: true
//     }).catch(err => {
//         console.error("Fetch Calculations Error:", err);
//         return [];
//     });

//     // 4. สรุปผลรวมคาร์บอน
//     let grandTotalCO2e = 0;
//     const scopeAgg = {};
//     const categoryAgg = {};
//     const materialAgg = {};

//     calculations.forEach(calc => {
//         const co2 = parseFloat(calc.total_co2e || 0);
//         grandTotalCO2e += co2;

//         const actScopeId = calc["activity.scope_id"] || calc["activity.scopeId"] || calc.scope_id;
//         const actCatId = calc["activity.category_id"] || calc["activity.categoryId"] || calc.category_id;
//         const actMatId = calc["activity.material_id"] || calc["activity.materialId"] || calc.material_id;

//         const matObj = materialMap[actMatId] || materialMap[String(actMatId)];

//         const scopeId = actScopeId || matObj?.scope_id || matObj?.scopeId || 1;
//         const categoryId = actCatId || matObj?.category_id || matObj?.categoryId || 1;
//         const materialId = actMatId || 0;

//         if (scopeId) scopeAgg[scopeId] = (scopeAgg[scopeId] || 0) + co2;
//         if (categoryId) categoryAgg[categoryId] = (categoryAgg[categoryId] || 0) + co2;
//         if (materialId) materialAgg[materialId] = (materialAgg[materialId] || 0) + co2;
//     });

//     // 5. Format ผลลัพธ์กลับไปแสดงผล
//     const formattedScopeSummary = Object.keys(scopeAgg).map(sId => {
//         const idNum = Number(sId);
//         const sObj = scopeMap[idNum] || scopeMap[sId];
//         return {
//             scope_id: idNum,
//             scope_code: sObj?.code || `SCOPE_${idNum}`,
//             scope_name: sObj?.name || (idNum === 2 ? "Scope 2 : Indirect Energy Emissions" : `Scope ${idNum}`),
//             total_co2e: Number(scopeAgg[sId].toFixed(6))
//         };
//     }).sort((a, b) => a.scope_id - b.scope_id);

//     const formattedCategorySummary = Object.keys(categoryAgg).map(cId => {
//         const idNum = Number(cId);
//         const cObj = categoryMap[idNum] || categoryMap[cId];
//         return {
//             category_id: idNum,
//             category_code: cObj?.code || `CAT_${idNum}`,
//             category_name: cObj?.name || CATEGORY_NAMES[idNum] || `Category ${idNum}`,
//             total_co2e: Number(categoryAgg[cId].toFixed(6))
//         };
//     }).sort((a, b) => b.total_co2e - a.total_co2e);

//     const formattedMaterialSummary = Object.keys(materialAgg).map(mId => {
//         const idNum = Number(mId);
//         const mObj = materialMap[mId] || materialMap[idNum];
        
//         // 🟢 ดึงชื่อวัตถุดิบรองรับทุกชื่อ Field ในตาราง DB (name, material_name, title, name_th)
//         const matName = mObj?.name || mObj?.material_name || mObj?.title || mObj?.name_th || (idNum ? `Material #${idNum}` : "ไม่ระบุวัตถุดิบ");
//         const matUnit = mObj?.default_unit || mObj?.unit || '';

//         return {
//             material_id: idNum,
//             material_code: mObj?.code || null,
//             material_name: matName,
//             unit: matUnit,
//             total_co2e: Number(materialAgg[mId].toFixed(6))
//         };
//     }).sort((a, b) => b.total_co2e - a.total_co2e);

//     return {
//         total_co2e: Number(grandTotalCO2e.toFixed(6)),
//         total_activities: totalActivities,
//         start_date: startDate || null,
//         end_date: endDate || null,
//         scope_summary: formattedScopeSummary,
//         category_summary: formattedCategorySummary,
//         material_summary: formattedMaterialSummary
//     };
// };

// module.exports = {
//     calculateCarbonFootprint,
//     getCarbonSummary
// };

const { Op } = require("sequelize");

// นำเข้า Models ทั้งหมดอย่างปลอดภัย
const models = require("../models");
const Activity = models.Activity || require("../models/Activity");
const ActivityDetail = models.ActivityDetail || require("../models/ActivityDetail");
const CarbonCalculation = models.CarbonCalculation || require("../models/CarbonCalculation");
const Scope = models.Scope || require("../models/Scope");
const ScopeCategory = models.ScopeCategory || require("../models/ScopeCategory");
const ActivityType = models.ActivityType || require("../models/ActivityType");
const Material = models.Material || require("../models/Material");

const calculateCarbonFootprint = ({ quantity, emissionFactor }) => {
    if (quantity === undefined || quantity === null) throw new Error("กรุณาระบุปริมาณกิจกรรม");
    if (quantity < 0) throw new Error("ปริมาณกิจกรรมต้องไม่ติดลบ");
    if (!emissionFactor) throw new Error("ไม่พบ Emission Factor");

    const ef = Number(emissionFactor.total_co2e_factor || emissionFactor);
    if (isNaN(ef)) throw new Error("ค่า Emission Factor ไม่ถูกต้อง");

    const activityQuantity = Number(quantity);
    const totalCO2e = activityQuantity * ef;

    return {
        quantity: activityQuantity,
        emission_factor: ef,
        total_co2e: Number(totalCO2e.toFixed(6))
    };
};

// ========================================
// Get Carbon Summary (Synced with activity_types DB)
// ========================================

const getCarbonSummary = async ({ userId, startDate, endDate }) => {

    const activityWhere = {};
    if (userId) {
        activityWhere.user_id = userId;
    }

    if (startDate && endDate) {
        activityWhere.activity_date = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
        activityWhere.activity_date = { [Op.gte]: startDate };
    } else if (endDate) {
        activityWhere.activity_date = { [Op.lte]: endDate };
    }

    // 1. ดึง Master Data ตรงจากตาราง activity_types ใน MySQL
    let scopesList = [];
    let activityTypesList = [];
    let materialsList = [];

    try { scopesList = await Scope.findAll({ raw: true }); } catch (e) {}
    try { 
        activityTypesList = await ActivityType.findAll({ raw: true });
        console.log("🟢 Loaded activity_types count:", activityTypesList.length);
    } catch (e) {
        console.error("🔴 Fetch ActivityType Error:", e.message);
    }
    try { materialsList = await Material.findAll({ raw: true }); } catch (e) {}

    const scopeMap = {};
    scopesList.forEach(s => { scopeMap[s.id || s.scope_id] = s; });

    // 🟢 Map ข้อมูลจากตาราง activity_types (ตาม ID และ category_id)
    const activityTypeMap = {};
    activityTypesList.forEach(at => {
        if (at.id !== undefined) {
            activityTypeMap[at.id] = at;
            activityTypeMap[String(at.id)] = at;
        }
        if (at.category_id !== undefined) {
            activityTypeMap[`cat_${at.category_id}`] = at;
        }
    });

    const materialMap = {};
    materialsList.forEach(m => {
        const key = m.id !== undefined ? m.id : m.material_id;
        if (key !== undefined && key !== null) {
            materialMap[key] = m;
            materialMap[String(key)] = m;
        }
    });

    // 2. ดึงรายการ Activity ทั้งหมด
    const activitiesList = await Activity.findAll({
        where: activityWhere,
        attributes: ['id', 'user_id', 'activity_date'],
        raw: true
    }).catch(() => []);

    const activityIds = activitiesList.map(a => a.id);
    const totalActivitiesCount = activitiesList.length;

    if (activityIds.length === 0) {
        return {
            total_co2e: 0,
            total_activities: 0,
            start_date: startDate || null,
            end_date: endDate || null,
            scope_summary: [],
            category_summary: [],
            material_summary: []
        };
    }

    // 3. ดึงรายละเอียดกิจกรรม
    let detailsList = [];
    try {
        if (ActivityDetail) {
            detailsList = await ActivityDetail.findAll({
                where: { activity_id: { [Op.in]: activityIds } },
                raw: true
            });
        }
    } catch (e) {}

    if (!detailsList || detailsList.length === 0) {
        try {
            if (CarbonCalculation) {
                detailsList = await CarbonCalculation.findAll({
                    where: { activity_id: { [Op.in]: activityIds } },
                    raw: true
                });
            }
        } catch (e) {}
    }

    // 4. สรุปผลรวมคาร์บอน
    let grandTotalCO2e = 0;
    const scopeAgg = {};
    const categoryAgg = {};
    const materialAgg = {};

    detailsList.forEach(detail => {
        const co2 = parseFloat(detail.carbon_footprint || detail.total_co2e || detail.co2e || 0);
        grandTotalCO2e += co2;

        const matId = detail.material_id;
        const matObj = materialMap[matId] || materialMap[String(matId)];

        const scopeId = detail.scope_id || matObj?.scope_id || matObj?.scopeId || 1;
        
        // ดึงประเภทกิจกรรม ID
        const typeId = detail.activity_type_id || detail.category_id || matObj?.category_id || 1;

        if (scopeId) scopeAgg[scopeId] = (scopeAgg[scopeId] || 0) + co2;
        if (typeId) categoryAgg[typeId] = (categoryAgg[typeId] || 0) + co2;

        if (matId) {
            if (!materialAgg[matId]) {
                materialAgg[matId] = {
                    material_id: matId,
                    scope_id: scopeId,
                    total_co2e: 0
                };
            }
            materialAgg[matId].total_co2e += co2;
        }
    });

    // 5.  Format Category Summary ดึงตรงจากคอลัมน์ name ในตาราง activity_types
    const formattedCategorySummary = Object.keys(categoryAgg).map(tId => {
        const idNum = Number(tId);
        const atObj = activityTypeMap[idNum] || activityTypeMap[String(idNum)] || activityTypeMap[`cat_${idNum}`];
        
        // ดึงชื่อ name จาก MySQL โดยตรง (เช่น "purchased heat", "Purchased Goods and Service")
        const typeName = atObj?.name || atObj?.activity_type_name || `Activity Type #${idNum}`;

        return {
            category_id: idNum,
            category_code: atObj?.code || `TYPE_${idNum}`,
            category_name: typeName,
            total_co2e: Number(categoryAgg[tId].toFixed(6))
        };
    }).sort((a, b) => b.total_co2e - a.total_co2e);

    // Format Top Material per Scope
    const topMaterialPerScope = {};
    Object.values(materialAgg).forEach(item => {
        const sId = item.scope_id;
        if (!topMaterialPerScope[sId] || item.total_co2e > topMaterialPerScope[sId].total_co2e) {
            topMaterialPerScope[sId] = item;
        }
    });

    const formattedMaterialSummary = Object.values(topMaterialPerScope).map(item => {
        const idNum = Number(item.material_id);
        const mObj = materialMap[idNum] || materialMap[String(idNum)];
        const matName = mObj?.name || mObj?.material_name || (idNum ? `Material #${idNum}` : "ไม่ระบุวัตถุดิบ");
        const matUnit = mObj?.default_unit || mObj?.unit || '';

        return {
            material_id: idNum,
            scope_id: item.scope_id,
            material_name: matName,
            unit: matUnit,
            total_co2e: Number(item.total_co2e.toFixed(6))
        };
    }).sort((a, b) => a.scope_id - b.scope_id);

    const formattedScopeSummary = Object.keys(scopeAgg).map(sId => {
        const idNum = Number(sId);
        const sObj = scopeMap[idNum] || scopeMap[sId];
        return {
            scope_id: idNum,
            scope_code: sObj?.code || `SCOPE_${idNum}`,
            scope_name: sObj?.name || `Scope ${idNum}`,
            total_co2e: Number(scopeAgg[sId].toFixed(6))
        };
    }).sort((a, b) => a.scope_id - b.scope_id);

    return {
        total_co2e: Number(grandTotalCO2e.toFixed(6)),
        total_activities: totalActivitiesCount,
        start_date: startDate || null,
        end_date: endDate || null,
        scope_summary: formattedScopeSummary,
        category_summary: formattedCategorySummary,
        material_summary: formattedMaterialSummary
    };
};

module.exports = {
    calculateCarbonFootprint,
    getCarbonSummary
};
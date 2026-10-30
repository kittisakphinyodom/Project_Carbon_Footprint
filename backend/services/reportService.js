const { Op } = require("sequelize");
const models = require("../models");
const sequelize = models.sequelize || require("../models").sequelize;

const Activity = models.Activity || require("../models/Activity");
const ActivityDetail = models.ActivityDetail || require("../models/ActivityDetail");

// แปลง Date/String ให้อยู่ในฟอร์แมต YYYY-MM-DD
const formatDateString = (dateVal) => {
  if (!dateVal) return "";
  if (dateVal instanceof Date) {
    const yyyy = dateVal.getFullYear();
    const mm = String(dateVal.getMonth() + 1).padStart(2, "0");
    const dd = String(dateVal.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  const str = String(dateVal);
  if (str.includes("T")) {
    const d = new Date(str);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  return str.substring(0, 10);
};

const getMonthlyReport = async ({ year, month, userId }) => {
  const targetYear = parseInt(year) || new Date().getFullYear();
  const targetMonth = parseInt(month) || new Date().getMonth() + 1;

  const startDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;
  const lastDay = new Date(targetYear, targetMonth, 0).getDate();
  const endDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const activityWhere = {
    activity_date: {
      [Op.gte]: `${startDate} 00:00:00`,
      [Op.lte]: `${endDate} 23:59:59`
    }
  };
  if (userId) activityWhere.user_id = userId;

  const activities = await Activity.findAll({
    where: activityWhere,
    attributes: ['id', 'user_id', 'activity_date'],
    raw: true
  }).catch(() => []);

  const activityDateMap = {};
  activities.forEach(a => {
    activityDateMap[a.id] = formatDateString(a.activity_date);
  });

  const activityIds = activities.map(a => a.id);

  const dailyData = {};
  for (let d = 1; d <= lastDay; d++) {
    const dayStr = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    dailyData[dayStr] = {
      date: dayStr,
      day: d,
      scope1: 0,
      scope2: 0,
      scope3: 0,
      total_co2e: 0,
      materials: {}
    };
  }

  if (activityIds.length === 0) {
    return {
      year: targetYear,
      month: targetMonth,
      total_monthly_co2e: 0,
      avg_daily_co2e: 0,
      peak_day: null,
      daily_reports: Object.values(dailyData)
    };
  }

  const details = await ActivityDetail.findAll({
    where: { activity_id: { [Op.in]: activityIds } },
    raw: true
  }).catch(() => []);

  // 1. ดึงชื่อวัตถุดิบจากตาราง materials ตรงๆ
  const materialMap = {};
  try {
    const [matRows] = await sequelize.query("SELECT id, name FROM materials");
    matRows.forEach(m => {
      if (m.id !== undefined && m.name) {
        materialMap[m.id] = m.name;
        materialMap[String(m.id)] = m.name;
      }
    });
  } catch (e) {
    console.error("Error fetching materials directly:", e.message);
  }

  // 2. ดึงชื่อจากตาราง emission_factors (สำรองไว้กรณี material_id อ้างอิง ID ของ Factor)
  const efMap = {};
  try {
    const [efRows] = await sequelize.query("SELECT id, material_id, name FROM emission_factors");
    efRows.forEach(ef => {
      if (ef.id !== undefined && ef.name) {
        efMap[ef.id] = ef.name;
        efMap[String(ef.id)] = ef.name;
      }
    });
  } catch (e) {}

  // 3. ดึงชื่อจากตาราง activity_types (สำรองกรณีใช้ประเภทกิจกรรมเป็นหลัก)
  const actTypeMap = {};
  try {
    const [actRows] = await sequelize.query("SELECT id, name FROM activity_types");
    actRows.forEach(act => {
      if (act.id !== undefined && act.name) {
        actTypeMap[act.id] = act.name;
        actTypeMap[String(act.id)] = act.name;
      }
    });
  } catch (e) {}

  // คำนวณคาร์บอนลงตารางรายวัน
  details.forEach(det => {
    const actDateStr = activityDateMap[det.activity_id];
    if (!actDateStr || !dailyData[actDateStr]) return;

    const co2 = parseFloat(det.carbon_footprint || 0);
    const scopeId = parseInt(det.scope_id || 1);
    
    // ค้นหาชื่อตามลำดับ: materials -> emission_factors -> activity_types
    const matId = det.material_id;
    const actTypeId = det.activity_type_id;

    const matName = materialMap[matId] || 
                    efMap[matId] || 
                    actTypeMap[actTypeId] || 
                    (matId ? `วัตถุดิบ #${matId}` : "-");

    if (scopeId === 1) dailyData[actDateStr].scope1 += co2;
    else if (scopeId === 2) dailyData[actDateStr].scope2 += co2;
    else if (scopeId === 3) dailyData[actDateStr].scope3 += co2;

    dailyData[actDateStr].total_co2e += co2;

    if (matName && matName !== "-") {
      dailyData[actDateStr].materials[matName] = (dailyData[actDateStr].materials[matName] || 0) + co2;
    }
  });

  let totalMonthlyCO2e = 0;
  let peakDay = null;
  let maxDayCO2e = 0;

  const dailyReports = Object.values(dailyData).map(day => {
    totalMonthlyCO2e += day.total_co2e;

    if (day.total_co2e > maxDayCO2e) {
      maxDayCO2e = day.total_co2e;
      peakDay = day.date;
    }

    let mainContributor = "-";
    let maxMatCO2 = 0;
    Object.entries(day.materials).forEach(([name, co2]) => {
      if (co2 > maxMatCO2) {
        maxMatCO2 = co2;
        mainContributor = name;
      }
    });

    return {
      date: day.date,
      day: day.day,
      scope1: Number(day.scope1.toFixed(4)),
      scope2: Number(day.scope2.toFixed(4)),
      scope3: Number(day.scope3.toFixed(4)),
      total_co2e: Number(day.total_co2e.toFixed(4)),
      main_contributor: mainContributor
    };
  });

  return {
    year: targetYear,
    month: targetMonth,
    total_monthly_co2e: Number(totalMonthlyCO2e.toFixed(4)),
    avg_daily_co2e: Number((totalMonthlyCO2e / lastDay).toFixed(4)),
    peak_day: peakDay,
    daily_reports: dailyReports
  };
};

module.exports = { getMonthlyReport };
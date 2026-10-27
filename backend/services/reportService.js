const { Op } = require("sequelize");
const models = require("../models");

const Activity = models.Activity || require("../models/Activity");
const ActivityDetail = models.ActivityDetail || require("../models/ActivityDetail");
const CarbonCalculation = models.CarbonCalculation || require("../models/CarbonCalculation");
const Material = models.Material || require("../models/Material");

// ฟังก์ชันช่วยแปลงวันที่ทุกรูปแบบให้อยู่ในฟอร์แมต "YYYY-MM-DD"
const formatDateString = (dateVal) => {
  if (!dateVal) return "";
  if (typeof dateVal === "string") return dateVal.substring(0, 10);
  if (dateVal instanceof Date) {
    const yyyy = dateVal.getFullYear();
    const mm = String(dateVal.getMonth() + 1).padStart(2, "0");
    const dd = String(dateVal.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  return String(dateVal).substring(0, 10);
};

const getMonthlyReport = async ({ year, month, userId }) => {
  const targetYear = parseInt(year) || new Date().getFullYear();
  const targetMonth = parseInt(month) || new Date().getMonth() + 1;

  // 1. ดึง Activity ทั้งหมดของเดือนนั้น
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

  console.log(`📌 [DEBUG Month ${targetMonth}/${targetYear}] ดึง Activity ได้ทั้งหมด: ${activities.length} รายการ`);

  // Map activity_id เป็น "YYYY-MM-DD"
  const activityDateMap = {};
  activities.forEach(a => {
    const formattedDate = formatDateString(a.activity_date);
    activityDateMap[a.id] = formattedDate;
  });

  const activityIds = activities.map(a => a.id);

  // เตรียมโครงสร้างข้อมูล 1..lastDay
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

  // 2. ดึงรายละเอียด ActivityDetail / CarbonCalculation
  const details = await ActivityDetail.findAll({
  where: { activity_id: { [Op.in]: activityIds } },
  raw: true
}).catch(() => []);

console.log(`📌 [DEBUG] จำนวน ActivityDetail ที่พบ: ${details.length}`);
if (details.length > 0) {
  console.log("📌 [DEBUG Sample Data]:", details[0]); // ดูชื่อฟิลด์จริงใน DB
}

details.forEach(det => {
  const actDateStr = activityDateMap[det.activity_id];
  if (!actDateStr || !dailyData[actDateStr]) return;

  // 🟢 ดึงค่าคาร์บอนจากคอลัมน์ที่เป็นไปได้ทั้งหมดใน DB
  const co2 = parseFloat(
    det.carbon_footprint || 
    det.total_co2e || 
    det.co2e || 
    det.co2 || 
    det.amount || 0
  );

  const scopeId = parseInt(det.scope_id || 1);
  if (scopeId === 1) dailyData[actDateStr].scope1 += co2;
  else if (scopeId === 2) dailyData[actDateStr].scope2 += co2;
  else if (scopeId === 3) dailyData[actDateStr].scope3 += co2;

  dailyData[actDateStr].total_co2e += co2;
});

  console.log(`📌 [DEBUG Details] ดึงรายการ ActivityDetails ได้: ${details.length} รายการ`);
  if (details.length > 0) {
    console.log("📌 [DEBUG Details Sample]:", details[0]); // ดูชื่อคอลัมน์ใน DB
  }

  // ดึง Master Data วัตถุดิบ
  const materials = await Material.findAll({ raw: true }).catch(() => []);
  const materialMap = {};
  materials.forEach(m => { 
    const key = m.id !== undefined ? m.id : m.material_id;
    if (key !== undefined) materialMap[key] = m;
  });

  // 3. หอดคาร์บอนลงตารางรายวัน
  details.forEach(det => {
    const actDateStr = activityDateMap[det.activity_id];
    if (!actDateStr || !dailyData[actDateStr]) return;

    // เช็กค่าคาร์บอนจากคอลัมน์ต่างๆ ที่เป็นไปได้
    const co2 = parseFloat(det.carbon_footprint || det.total_co2e || det.co2e || det.total_co2 || 0);
    const matId = det.material_id;
    const matObj = materialMap[matId];

    const scopeId = parseInt(det.scope_id || matObj?.scope_id || 1);
    const matName = matObj?.name || matObj?.material_name || det.material_name || `วัตถุดิบ #${matId || ''}`;

    if (scopeId === 1) dailyData[actDateStr].scope1 += co2;
    else if (scopeId === 2) dailyData[actDateStr].scope2 += co2;
    else if (scopeId === 3) dailyData[actDateStr].scope3 += co2;

    dailyData[actDateStr].total_co2e += co2;

    if (matName) {
      dailyData[actDateStr].materials[matName] = (dailyData[actDateStr].materials[matName] || 0) + co2;
    }
  });

  // 4. สรุปผลยอดรวม
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
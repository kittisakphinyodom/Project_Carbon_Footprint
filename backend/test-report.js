const models = require("./models");
const sequelize = models.sequelize || require("./models").sequelize;

async function checkMaterialTables() {
  try {
    console.log("\n=================== 🔍 CHECK MATERIAL TABLES 🔍 ===================");
    
    // 1. ตรวจสอบรายชื่อ Models ทั้งหมดในระบบ
    const loadedModels = Object.keys(models).filter(k => k !== 'sequelize' && k !== 'Sequelize');
    console.log("1. รายชื่อ Models ที่มีในระบบ:", loadedModels);

    // 2. ลอง Query ดูตาราง Materials หรือ Emission Factors ตรงๆ ด้วย SQL
    const [tables] = await sequelize.query("SHOW TABLES");
    console.log("2. รายชื่อตารางทั้งหมดใน MySQL Database:");
    console.log(tables.map(t => Object.values(t)[0]));

    // 3. ทดลองดึงข้อมูลจากตารางที่น่าจะเก็บชื่อวัตถุดิบ
    const potentialTables = ['materials', 'material', 'emission_factors', 'categories', 'activity_types'];
    
    for (const table of potentialTables) {
      try {
        const [rows] = await sequelize.query(`SELECT * FROM ${table} LIMIT 1`);
        if (rows.length > 0) {
          console.log(`\n✅ พบข้อมูลในตาราง [${table}]:`);
          console.log("   - โครงสร้างคอลัมน์:", Object.keys(rows[0]));
          console.log("   - ตัวอย่างข้อมูล 1 แถว:", rows[0]);
        }
      } catch (e) {
        // ตารางไม่มีอยู่จริง ข้ามไป
      }
    }

    console.log("\n===================================================================\n");
  } catch (error) {
    console.error("Diagnostic Error:", error);
  } finally {
    process.exit();
  }
}

checkMaterialTables();
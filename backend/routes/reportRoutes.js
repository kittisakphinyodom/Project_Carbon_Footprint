const express = require("express");
const router = express.Router();
const reportService = require("../services/reportService");

console.log("🟢 [INIT] reportRoutes.js loaded successfully!"); // เช็กว่าไฟล์ถูกโหลดตอนเปิดเซิร์ฟเวอร์ไหม

router.get("/monthly", async (req, res) => {
  console.log("📥 [API HIT] /api/reports/monthly triggered!"); // เช็กว่ามี Request วิ่งเข้ามาไหม
  try {
    const { year, month, userId } = req.query;
    const data = await reportService.getMonthlyReport({ 
      year, 
      month, 
      userId: userId || null 
    });
    return res.json({ success: true, data });
  } catch (error) {
    console.error("Report Route Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
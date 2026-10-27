const reportService = require("../services/reportService");

const getMonthlyReport = async (req, res) => {
  try {
    const { year, month } = req.query;

    // เช็กสิทธิ์ User (แปลงเป็นตัวพิมพ์ใหญ่เพื่อป้องกันปัญหา STAFF vs staff)
    const userRole = req.user?.role?.toUpperCase();
    const userId = userRole === 'STAFF' ? req.user.id : null;

    console.log(`📥 [Controller] Year: ${year}, Month: ${month}, Role: ${userRole || 'GUEST'}, FilterUserId: ${userId}`);

    const data = await reportService.getMonthlyReport({ year, month, userId });
    return res.json({ success: true, data });
  } catch (error) {
    console.error("Report Controller Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "เกิดข้อผิดพลาดในการสร้างรายงาน",
      error: error.message 
    });
  }
};

module.exports = { getMonthlyReport };
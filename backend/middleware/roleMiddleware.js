const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            // Check authentication
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "กรุณาเข้าสู่ระบบ"
                });
            }

            // Check role
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้"
                });
            }

            next();

        } catch (error) {
            console.error("Role middleware error:", error.message);

            return res.status(500).json({
                success: false,
                message: "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์"
            });
        }
    };
};

module.exports = roleMiddleware;
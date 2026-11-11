const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");

const {
    Role,
    User,
    Scope,
    ScopeCategory,
    ActivityType
} = require("./models");

const scopeRoutes = require("./routes/scopeRoutes");
const emissionFactorRoutes = require("./routes/emissionFactorRoutes");
const carbonCalculationRoutes = require("./routes/carbonCalculationRoutes");
const activityRoutes = require("./routes/activityRoutes");
const materialRoutes = require("./routes/materialRoutes");
const activityTypeRoutes = require("./routes/activityTypeRoutes");
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// 🟢 1. ซ่อน Header ที่บอกว่าใช้ Express Framework
app.disable("x-powered-by");

// 🟢 2. กำหนดเงื่อนไข CORS ให้ปลอดภัยเฉพาะโดเมนที่อนุญาต
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

// Middleware
app.use(cors(corsOptions)); // 🟢 แก้ไขตรงนี้: ใส่ corsOptions เพื่อบังคับใช้การตั้งค่าความปลอดภัย
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/scopes", scopeRoutes);
app.use("/api/emission-factors", emissionFactorRoutes);
app.use("/api/carbon-calculations", carbonCalculationRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/activity-types", activityTypeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);

// Test API
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Hotel Carbon Footprint API is running"
    });
});

// Test Database Connection
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("MySQL database connected successfully.");

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Unable to connect to MySQL:");
        console.error(error.message);
    }
};

startServer();
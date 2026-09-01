const express = require("express");

const router = express.Router();

const {
    calculate,
    getSummary
} = require("../controllers/carbonCalculationController");

const authMiddleware = require("../middleware/authMiddleware");

// POST /api/carbon-calculations
router.post("/", authMiddleware, calculate);

// GET /api/carbon-calculations/summary
router.get("/summary", authMiddleware, getSummary);

module.exports = router;
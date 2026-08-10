const express = require("express");

const router = express.Router();

const {
    calculate,
    getSummary
} = require("../controllers/carbonCalculationController");

// POST /api/carbon-calculations
router.post("/", calculate);

// GET /api/carbon-calculations/summary
router.get("/summary", getSummary);

module.exports = router;
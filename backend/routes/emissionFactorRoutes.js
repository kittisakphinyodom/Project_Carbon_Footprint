const express = require("express");

const router = express.Router();

const {
    getAllEmissionFactors
} = require("../controllers/emissionFactorController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getAllEmissionFactors);

module.exports = router;
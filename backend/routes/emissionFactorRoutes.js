const express = require("express");

const router = express.Router();

const {
    getAllEmissionFactors
} = require("../controllers/emissionFactorController");

router.get("/", getAllEmissionFactors);

module.exports = router;
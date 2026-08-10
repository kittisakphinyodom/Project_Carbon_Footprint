const express = require("express");

const router = express.Router();

const {
    getMaterials,
    getMaterialById
} = require("../controllers/materialController");

// GET /api/materials
router.get("/", getMaterials);

// GET /api/materials/:id
router.get("/:id", getMaterialById);

module.exports = router;
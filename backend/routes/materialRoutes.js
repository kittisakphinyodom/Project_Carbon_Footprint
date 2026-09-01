const express = require("express");

const router = express.Router();

const {
    getMaterials,
    getMaterialById
} = require("../controllers/materialController");

const authMiddleware = require("../middleware/authMiddleware");

// GET /api/materials
router.get("/", authMiddleware, getMaterials);

// GET /api/materials/:id
router.get("/:id", authMiddleware,  getMaterialById);

module.exports = router;
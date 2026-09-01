const express = require("express");

const router = express.Router();

const {
    getAllScopes,
    getScopeById
} = require("../controllers/scopeController");

const authMiddleware = require("../middleware/authMiddleware");

// GET /api/scopes
router.get("/", authMiddleware, getAllScopes);

// GET /api/scopes/:id
router.get("/:id", authMiddleware, getScopeById);

module.exports = router;
const express = require("express");

const router = express.Router();

const {
    getAllScopes,
    getScopeById
} = require("../controllers/scopeController");

// GET /api/scopes
router.get("/", getAllScopes);

// GET /api/scopes/:id
router.get("/:id", getScopeById);

module.exports = router;
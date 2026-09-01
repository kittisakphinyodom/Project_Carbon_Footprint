const express = require("express");

const router = express.Router();

const {
    login,
    register,
    googleLogin
} = require("../controllers/authController");

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/register
router.post("/register", register);

// Google Login
router.post("/google", googleLogin);

module.exports = router;
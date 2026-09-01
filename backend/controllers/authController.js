const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const { User, Role } = require("../models");

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

// ========================================
// POST /api/auth/login
// Login
// ========================================

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "กรุณากรอก Username และ Password"
            });
        }

        // Find active user
        const user = await User.findOne({
            where: {
                username: username,
                status: "ACTIVE"
            },

            include: [
                {
                    model: Role,
                    as: "role",
                    attributes: [
                        "id",
                        
                        "name"
                    ]
                }
            ]
        });

        // User not found
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Username หรือ Password ไม่ถูกต้อง"
            });
        }

        // Check password
        const passwordValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordValid) {
            return res.status(401).json({
                success: false,
                message: "Username หรือ Password ไม่ถูกต้อง"
            });
        }

        // JWT Secret
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured");
        }

        // Create token
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role_id: user.role_id,
                role: user.role.name
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // Response
        return res.status(200).json({
            success: true,
            message: "เข้าสู่ระบบสำเร็จ",

            data: {
                token,

                user: {
                    id: user.id,
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role_id: user.role_id,
                    role: user.role
                }
            }
        });

    } catch (error) {

        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
            error: error.message
        });
    }
};

// ========================================
// POST /api/auth/signup
// Sign Up
// ========================================

const register = async (req, res) => {
    try {
        const {
            username,
            password,
            first_name,
            last_name,
            email
        } = req.body;

        // Validate required fields
        if (!username || !password || !first_name || !last_name || !email) {
            return res.status(400).json({
                success: false,
                message: "กรุณากรอกข้อมูลให้ครบถ้วน"
            });
        }

        // Check duplicate username
        const existingUsername = await User.findOne({
            where: {
                username
            }
        });

        if (existingUsername) {
            return res.status(409).json({
                success: false,
                message: "Username นี้ถูกใช้งานแล้ว"
            });
        }

        // Check duplicate email
        const existingEmail = await User.findOne({
            where: {
                email
            }
        });

        if (existingEmail) {
            return res.status(409).json({
                success: false,
                message: "Email นี้ถูกใช้งานแล้ว"
            });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            username,
            password_hash,
            first_name,
            last_name,
            email,

            // ผู้สมัครใหม่เป็น STAFF
            role_id: 2,

            
            status: "ACTIVE"
        });

        return res.status(201).json({
            success: true,
            message: "สมัครสมาชิกสำเร็จ",
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role_id: user.role_id,
                    status: user.status
                }
            }
        });

    } catch (error) {

        console.error("Signup error:", error);

        return res.status(500).json({
            success: false,
            message: "เกิดข้อผิดพลาดในการสมัครสมาชิก",
            error: error.message
        });
    }
};

const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                success: false,
                message: "ไม่พบ Google Credential"
            });
        }

        // Verify Google ID Token
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        const {
            sub: google_id,
            email,
            given_name,
            family_name,
            email_verified
        } = payload;

        if (!email_verified) {
            return res.status(401).json({
                success: false,
                message: "Google Email ยังไม่ได้รับการยืนยัน"
            });
        }

        // Find user by Google ID
        let user = await User.findOne({
            where: {
                google_id
            },
            include: [
                {
                    model: Role,
                    as: "role",
                    attributes: ["id", "name"]
                }
            ]
        });

        // If not found, find by email
        if (!user) {
            user = await User.findOne({
                where: {
                    email
                },
                include: [
                    {
                        model: Role,
                        as: "role",
                        attributes: ["id", "name"]
                    }
                ]
            });
        }

        // Create new user if not found
        if (!user) {
            user = await User.create({
                username: email,
                password_hash: await bcrypt.hash(
                    Math.random().toString(36) + Date.now(),
                    10
                ),
                google_id,
                first_name: given_name || "",
                last_name: family_name || "",
                email,
                role_id: 2,
                status: "ACTIVE"
            });

            user = await User.findByPk(user.id, {
                include: [
                    {
                        model: Role,
                        as: "role",
                        attributes: ["id", "name"]
                    }
                ]
            });
        } else {

            // Link Google account to existing user
            if (!user.google_id) {
                user.google_id = google_id;
                await user.save();
            }
        }

        // Check account status
        if (user.status !== "ACTIVE") {
            return res.status(403).json({
                success: false,
                message: "บัญชีนี้ถูกระงับการใช้งาน"
            });
        }

        // Create our system JWT
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role_id: user.role_id,
                role: user.role.name
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "เข้าสู่ระบบด้วย Google สำเร็จ",

            data: {
                token,

                user: {
                    id: user.id,
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role_id: user.role_id,
                    role: user.role
                }
            }
        });

    } catch (error) {

        console.error("Google Login error:", error);

        return res.status(401).json({
            success: false,
            message: "Google Login ไม่สำเร็จ",
            error: error.message
        });
    }
};

module.exports = {
    login, 
    register,
    googleLogin
};
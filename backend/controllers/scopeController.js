const { Scope, ScopeCategory } = require("../models");

// ========================================
// GET /api/scopes
// Get all scopes with categories
// ========================================

const getAllScopes = async (req, res) => {
    try {
        const scopes = await Scope.findAll({
            include: [
                {
                    model: ScopeCategory,
                    as: "categories",
                    attributes: [
                        "id",
                        "code",
                        "name"
                        
                    ],
                    where: {
                        status: "ACTIVE"
                    },
                    required: false
                }
            ],
            order: [["id", "ASC"]]
        });

        res.status(200).json({
            success: true,
            data: scopes
        });

    } catch (error) {
        console.error("Get scopes error:", error);

        res.status(500).json({
            success: false,
            message: "ไม่สามารถดึงข้อมูล Scope ได้",
            error: error.message
        });
    }
};


// ========================================
// GET /api/scopes/:id
// Get single scope
// ========================================

const getScopeById = async (req, res) => {
    try {
        const { id } = req.params;

        const scope = await Scope.findByPk(id, {
            include: [
                {
                    model: ScopeCategory,
                    as: "categories",
                    where: {
                        status: "ACTIVE"
                    },
                    required: false
                }
            ]
        });

        if (!scope) {
            return res.status(404).json({
                success: false,
                message: "ไม่พบ Scope ที่ต้องการ"
            });
        }

        res.status(200).json({
            success: true,
            data: scope
        });

    } catch (error) {
        console.error("Get scope error:", error);

        res.status(500).json({
            success: false,
            message: "ไม่สามารถดึงข้อมูล Scope ได้",
            error: error.message
        });
    }
};

module.exports = {
    getAllScopes,
    getScopeById
};
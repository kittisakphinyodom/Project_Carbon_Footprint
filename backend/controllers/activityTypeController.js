const {
    ActivityType,
    ScopeCategory
} = require("../models");

// ========================================
// GET /api/activity-types
// Get all active activity types
// ========================================

const getAllActivityTypes = async (req, res) => {

    try {

        const activityTypes = await ActivityType.findAll({

            where: {
                status: "ACTIVE"
            },

            include: [
                {
                    model: ScopeCategory,
                    as: "category",
                    attributes: [
                        "id",
                        "scope_id",
                        "code",
                        "name"
                    ]
                }
            ],

            order: [
                ["id", "ASC"]
            ]

        });

        return res.status(200).json({

            success: true,

            count: activityTypes.length,

            data: activityTypes

        });

    } catch (error) {

        console.error(
            "Get activity types error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "ไม่สามารถดึงข้อมูล Activity Type ได้",

            error: error.message

        });

    }

};


// ========================================
// GET /api/activity-types/category/:categoryId
// Get activity types by category
// ========================================

const getActivityTypesByCategory = async (req, res) => {

    try {

        const {
            categoryId
        } = req.params;


        const activityTypes = await ActivityType.findAll({

            where: {
                category_id: categoryId,
                status: "ACTIVE"
            },

            attributes: [
                "id",
                "category_id",
                "code",
                "name",
                "default_unit",
                "description",
                "status"
            ],

            order: [
                ["id", "ASC"]
            ]

        });


        return res.status(200).json({

            success: true,

            count: activityTypes.length,

            data: activityTypes

        });

    } catch (error) {

        console.error(
            "Get activity types by category error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "ไม่สามารถดึงข้อมูล Activity Type ตาม Category ได้",

            error: error.message

        });

    }

};


// ========================================
// GET /api/activity-types/:id
// Get activity type by ID
// ========================================

const getActivityTypeById = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        const activityType = await ActivityType.findOne({

            where: {
                id: id,
                status: "ACTIVE"
            },

            include: [
                {
                    model: ScopeCategory,
                    as: "category",
                    attributes: [
                        "id",
                        "scope_id",
                        "code",
                        "name"
                    ]
                }
            ]

        });


        if (!activityType) {

            return res.status(404).json({

                success: false,

                message: "ไม่พบ Activity Type ที่ต้องการ"

            });

        }


        return res.status(200).json({

            success: true,

            data: activityType

        });

    } catch (error) {

        console.error(
            "Get activity type error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "ไม่สามารถดึงข้อมูล Activity Type ได้",

            error: error.message

        });

    }

};


module.exports = {

    getAllActivityTypes,

    getActivityTypesByCategory,

    getActivityTypeById

};
const {
    EmissionFactor,
    EmissionFactorSource,
    EmissionFactorVersion,
    Scope,
    ScopeCategory,
    ActivityType
} = require("../models");

const getAllEmissionFactors = async (req, res) => {

    try {

        const {
            scope_id,
            category_id,
            activity_type_id,
            search
        } = req.query;

        const where = {
            status: "ACTIVE"
        };

        if (scope_id) {
            where.scope_id = scope_id;
        }

        if (category_id) {
            where.category_id = category_id;
        }

        if (activity_type_id) {
            where.activity_type_id = activity_type_id;
        }

        if (search) {
            const { Op } = require("sequelize");

            where.name = {
                [Op.like]: `%${search}%`
            };
        }

        const emissionFactors = await EmissionFactor.findAll({

            where,

            include: [
                {
                    model: EmissionFactorSource,
                    as: "source",
                    attributes: [
                        "id",
                        "name",
                        "organization"
                    ]
                },

                {
                    model: EmissionFactorVersion,
                    as: "version",
                    attributes: [
                        "id",
                        "version_name",
                        "version_code",
                        "publication_date",
                        "effective_date"
                    ]
                },

                {
                    model: Scope,
                    as: "scope",
                    attributes: [
                        "id",
                        "code",
                        "name"
                    ]
                },

                {
                    model: ScopeCategory,
                    as: "category",
                    attributes: [
                        "id",
                        "code",
                        "name"
                    ]
                },

                {
                    model: ActivityType,
                    as: "activityType",
                    attributes: [
                        "id",
                        "code",
                        "name",
                        "default_unit"
                    ]
                }
            ],

            order: [
                ["priority", "ASC"],
                ["id", "ASC"]
            ]
        });

        res.status(200).json({
            success: true,
            count: emissionFactors.length,
            data: emissionFactors
        });

    } catch (error) {

        console.error("Get emission factors error:", error);

        res.status(500).json({
            success: false,
            message: "ไม่สามารถดึงข้อมูล Emission Factor ได้",
            error: error.message
        });

    }
};

module.exports = {
    getAllEmissionFactors
};
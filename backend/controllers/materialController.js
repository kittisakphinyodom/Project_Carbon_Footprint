
const {
    Material,
    EmissionFactor,
    ScopeCategory,
    Scope
} = require("../models");

// ========================================
// GET /api/materials
// Get all active materials with Emission Factor
// ========================================

const getMaterials = async (req, res) => {
    try {

        const materials = await Material.findAll({
            where: {
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

            include: [
    {
        model: ScopeCategory,
        as: "category",

        attributes: [
            "id",
            "scope_id",
            "code",
            "name"
        ],

        include: [
            {
                model: Scope,
                as: "scope",

                attributes: [
                    "id",
                    "code",
                    "name"
                ]
            }
        ]
    },

    {
        model: EmissionFactor,
        as: "emissionFactors",

        attributes: [
            "id",
            "material_id",
            "name",
            "unit",
            "co2_factor",
            "ch4_factor",
            "n2o_factor",
            "total_co2e_factor",
            "emission_type",
            "reference",
            "reference_year",
            "valid_from",
            "valid_to",
            "priority",
            "status"
        ],

        where: {
            status: "ACTIVE"
        },

        required: false,

        separate: true,

        order: [
            ["priority", "DESC"],
            ["id", "DESC"]
        ],

        limit: 1
    }
],

            order: [
                ["name", "ASC"]
            ]
        });


        // ========================================
        // Format Response
        // ========================================

        const formattedMaterials = materials.map((material) => {

            const item = material.toJSON();

            const emissionFactor =
                item.emissionFactors &&
                item.emissionFactors.length > 0
                    ? item.emissionFactors[0]
                    : null;


            return {
    id: item.id,

    category_id: item.category_id,

    code: item.code,

    name: item.name,

    default_unit: item.default_unit,

    description: item.description,

    status: item.status,

    category: item.category
        ? {
            id: item.category.id,
            scope_id: item.category.scope_id,
            code: item.category.code,
            name: item.category.name
        }
        : null,

    scope: item.category?.scope
        ? {
            id: item.category.scope.id,
            code: item.category.scope.code,
            name: item.category.scope.name
        }
        : null,

    emission_factor: emissionFactor
        ? Number(emissionFactor.total_co2e_factor)
        : null,

    emission_factor_unit: emissionFactor
        ? `kgCO2e/${item.default_unit}`
        : null,

    emission_factor_id: emissionFactor
        ? emissionFactor.id
        : null,

    emission_factor_name: emissionFactor
        ? emissionFactor.name
        : null
};
        });


        return res.status(200).json({
            success: true,
            count: formattedMaterials.length,
            data: formattedMaterials
        });

    } catch (error) {

        console.error(
            "Get materials error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "ไม่สามารถดึงข้อมูล Material ได้",
            error: error.message
        });

    }
};


// ========================================
// GET /api/materials/:id
// Get material by ID with Emission Factor
// ========================================

const getMaterialById = async (req, res) => {
    try {

        const { id } = req.params;


        const material = await Material.findOne({

            where: {
                id,
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

            include: [
                {
                    model: EmissionFactor,
                    as: "emissionFactors",

                    attributes: [
                        "id",
                        "material_id",
                        "name",
                        "unit",
                        "co2_factor",
                        "ch4_factor",
                        "n2o_factor",
                        "total_co2e_factor",
                        "emission_type",
                        "reference",
                        "reference_year",
                        "valid_from",
                        "valid_to",
                        "priority",
                        "status"
                    ],

                    where: {
                        status: "ACTIVE"
                    },

                    required: false,

                    separate: true,

                    order: [
                        ["priority", "DESC"],
                        ["id", "DESC"]
                    ],

                    limit: 1
                }
            ]
        });


        if (!material) {

            return res.status(404).json({
                success: false,
                message: "ไม่พบ Material ที่ต้องการ"
            });

        }


        // ========================================
        // Format Response
        // ========================================

        const item = material.toJSON();

        const emissionFactor =
            item.emissionFactors &&
            item.emissionFactors.length > 0
                ? item.emissionFactors[0]
                : null;


        const result = {

            id: item.id,

            category_id: item.category_id,

            code: item.code,

            name: item.name,

            default_unit: item.default_unit,

            description: item.description,

            status: item.status,

            emission_factor: emissionFactor
                ? Number(emissionFactor.total_co2e_factor)
                : null,

            emission_factor_unit: emissionFactor
    ? `kgCO2e/${item.default_unit}`
    : null,

            emission_factor_id: emissionFactor
                ? emissionFactor.id
                : null,

            emission_factor_name: emissionFactor
                ? emissionFactor.name
                : null,

            emission_factor_details: emissionFactor
                ? emissionFactor
                : null
        };


        return res.status(200).json({
            success: true,
            data: result
        });


    } catch (error) {

        console.error(
            "Get material error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "ไม่สามารถดึงข้อมูล Material ได้",
            error: error.message
        });

    }
};


module.exports = {
    getMaterials,
    getMaterialById
};


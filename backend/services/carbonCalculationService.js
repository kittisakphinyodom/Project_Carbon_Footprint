const { fn, col, Op } = require("sequelize");

const CarbonCalculation = require("../models/CarbonCalculation");
const Activity = require("../models/Activity");
const Scope = require("../models/Scope");
const ScopeCategory = require("../models/ScopeCategory");
const Material = require("../models/Material");

// ========================================
// Calculate Carbon Footprint
// ========================================

const calculateCarbonFootprint = ({
    quantity,
    emissionFactor
}) => {

    if (quantity === undefined || quantity === null) {
        throw new Error("กรุณาระบุปริมาณกิจกรรม");
    }

    if (quantity < 0) {
        throw new Error("ปริมาณกิจกรรมต้องไม่ติดลบ");
    }

    if (!emissionFactor) {
        throw new Error("ไม่พบ Emission Factor");
    }

    const ef = Number(emissionFactor.total_co2e_factor);

    if (isNaN(ef)) {
        throw new Error("ค่า Emission Factor ไม่ถูกต้อง");
    }

    const activityQuantity = Number(quantity);

    const totalCO2e = activityQuantity * ef;

    return {
        quantity: activityQuantity,
        emission_factor: ef,
        total_co2e: Number(totalCO2e.toFixed(6))
    };
};


// ========================================
// Get Carbon Summary
// ========================================

const getCarbonSummary = async ({
    userId,
    startDate,
    endDate
}) => {

    // ========================================
    // Activity Filter
    // ========================================

    const activityWhere = {};

    if (userId) {
        activityWhere.user_id = userId;
    }

    // ========================================
    // Date Filter
    // ========================================

    if (startDate && endDate) {

        activityWhere.activity_date = {
            [Op.between]: [startDate, endDate]
        };

    } else if (startDate) {

        activityWhere.activity_date = {
            [Op.gte]: startDate
        };

    } else if (endDate) {

        activityWhere.activity_date = {
            [Op.lte]: endDate
        };

    }


    // ========================================
    // Total Carbon Footprint
    // ========================================

    const totalResult = await CarbonCalculation.findOne({

        attributes: [
            [
                fn(
                    "COALESCE",
                    fn("SUM", col("total_co2e")),
                    0
                ),
                "total_co2e"
            ]
        ],

        include: [

            {
                model: Activity,
                as: "activity",
                attributes: [],
                where: activityWhere,
                required: true
            }

        ],

        raw: true

    });


    // ========================================
    // Total Activities
    // ========================================

    const totalActivities = await Activity.count({

        where: activityWhere,

        include: [

            {
                model: CarbonCalculation,
                as: "calculations",
                required: true
            }

        ],

        distinct: true

    });


    // ========================================
    // Scope Summary
    // ========================================

    const scopeSummary = await CarbonCalculation.findAll({

        attributes: [

            [
                fn(
                    "SUM",
                    col("total_co2e")
                ),
                "total_co2e"
            ]

        ],

        include: [

            {
                model: Activity,
                as: "activity",

                attributes: [
                    "scope_id"
                ],

                where: activityWhere,

                required: true,

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

            }

        ],

        group: [
            "activity.scope_id",
            "activity->scope.id"
        ],

        raw: true

    });


    // ========================================
    // Category Summary
    // ========================================

    const categorySummary = await CarbonCalculation.findAll({

        attributes: [

            [
                fn(
                    "SUM",
                    col("total_co2e")
                ),
                "total_co2e"
            ]

        ],

        include: [

            {
                model: Activity,
                as: "activity",

                attributes: [
                    "category_id"
                ],

                where: activityWhere,

                required: true,

                include: [

                    {
                        model: ScopeCategory,
                        as: "category",

                        attributes: [
                            "id",
                            "code",
                            "name"
                        ]
                    }

                ]

            }

        ],

        group: [
            "activity.category_id",
            "activity->category.id"
        ],

        raw: true

    });


    // ========================================
    // Material Summary
    // ========================================

    const materialSummary = await CarbonCalculation.findAll({

        attributes: [

            [
                fn(
                    "SUM",
                    col("total_co2e")
                ),
                "total_co2e"
            ]

        ],

        include: [

            {
                model: Activity,
                as: "activity",

                attributes: [
                    "material_id"
                ],

                where: activityWhere,

                required: true,

                include: [

                    {
                        model: Material,
                        as: "material",

                        attributes: [
                            "id",
                            "code",
                            "name"
                        ]
                    }

                ]

            }

        ],

        group: [
            "activity.material_id",
            "activity->material.id"
        ],

        raw: true

    });


    // ========================================
    // Format Scope Summary
    // ========================================

    const formattedScopeSummary = scopeSummary.map(item => ({

        scope_id: item["activity.scope_id"],

        scope_code: item["activity->scope.code"],

        scope_name: item["activity->scope.name"],

        total_co2e: Number(
            Number(item.total_co2e || 0).toFixed(6)
        )

    }));


    // ========================================
    // Format Category Summary
    // ========================================

    const formattedCategorySummary = categorySummary.map(item => ({

        category_id: item["activity.category_id"],

        category_code: item["activity->category.code"],

        category_name: item["activity->category.name"],

        total_co2e: Number(
            Number(item.total_co2e || 0).toFixed(6)
        )

    }));


    // ========================================
    // Format Material Summary
    // ========================================

    const formattedMaterialSummary = materialSummary.map(item => ({

        material_id: item["activity.material_id"],

        material_code: item["activity->material.code"],

        material_name: item["activity->material.name"],

        total_co2e: Number(
            Number(item.total_co2e || 0).toFixed(6)
        )

    }));


    // ========================================
    // Return Dashboard Summary
    // ========================================

    return {

        total_co2e: Number(
            Number(
                totalResult?.total_co2e || 0
            ).toFixed(6)
        ),

        total_activities: totalActivities,

        start_date: startDate || null,

        end_date: endDate || null,

        scope_summary: formattedScopeSummary,

        category_summary: formattedCategorySummary,

        material_summary: formattedMaterialSummary

    };

};


module.exports = {
    calculateCarbonFootprint,
    getCarbonSummary
};
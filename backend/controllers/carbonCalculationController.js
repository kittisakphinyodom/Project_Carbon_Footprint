const {
    EmissionFactor,
    EmissionFactorSource,
    EmissionFactorVersion,
    Scope,
    ScopeCategory,
    ActivityType
} = require("../models");

const {
    calculateCarbonFootprint,
    getCarbonSummary
} = require("../services/carbonCalculationService");


// ========================================
// POST /api/carbon-calculations
// Calculate Carbon Footprint
// ========================================

const calculate = async (req, res) => {

    try {

        const {
            emission_factor_id,
            quantity,
            unit
        } = req.body;


        // ========================================
        // Validate input
        // ========================================

        if (
            emission_factor_id === undefined ||
            emission_factor_id === null
        ) {
            return res.status(400).json({
                success: false,
                message: "กรุณาระบุ emission_factor_id"
            });
        }


        if (quantity === undefined || quantity === null) {

            return res.status(400).json({
                success: false,
                message: "กรุณาระบุ quantity"
            });

        }


        if (isNaN(Number(quantity))) {

            return res.status(400).json({
                success: false,
                message: "quantity ต้องเป็นตัวเลข"
            });

        }


        if (Number(quantity) < 0) {

            return res.status(400).json({
                success: false,
                message: "quantity ต้องไม่ติดลบ"
            });

        }


        // ========================================
        // Find Emission Factor
        // ========================================

        const emissionFactor = await EmissionFactor.findOne({

            where: {
                id: emission_factor_id,
                status: "ACTIVE"
            },

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

            ]

        });


        // ========================================
        // Check EF exists
        // ========================================

        if (!emissionFactor) {

            return res.status(404).json({
                success: false,
                message: "ไม่พบ Emission Factor ที่ใช้งานอยู่"
            });

        }


        // ========================================
        // Check Unit
        // ========================================

        if (
            unit &&
            emissionFactor.unit &&
            unit !== emissionFactor.unit
        ) {

            return res.status(400).json({

                success: false,

                message: "หน่วยของข้อมูลไม่ตรงกับหน่วยของ Emission Factor",

                data: {
                    input_unit: unit,
                    emission_factor_unit: emissionFactor.unit
                }

            });

        }


        // ========================================
        // Calculate
        // ========================================

        const calculation = calculateCarbonFootprint({

            quantity: Number(quantity),

            emissionFactor: emissionFactor

        });


        // ========================================
        // Response
        // ========================================

        return res.status(200).json({

            success: true,

            message: "คำนวณ Carbon Footprint สำเร็จ",

            data: {

                emission_factor_id: emissionFactor.id,

                activity: {
                    id: emissionFactor.activityType?.id || null,
                    code: emissionFactor.activityType?.code || null,
                    name: emissionFactor.activityType?.name || null
                },

                scope: emissionFactor.scope,

                category: emissionFactor.category,

                quantity: calculation.quantity,

                unit: emissionFactor.unit,

                emission_factor: calculation.emission_factor,

                emission_factor_name: emissionFactor.name,

                total_co2e: calculation.total_co2e,

                co2e_unit: "kgCO2e",

                source: emissionFactor.source,

                version: emissionFactor.version

            }

        });

    } catch (error) {

        console.error(
            "Carbon calculation error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "เกิดข้อผิดพลาดในการคำนวณ Carbon Footprint",

            error: error.message

        });

    }

};

const getSummary = async (req, res) => {

    try {

        const userId = req.query.user_id
            ? Number(req.query.user_id)
            : null;

        const startDate = req.query.start_date || null;

        const endDate = req.query.end_date || null;


        // ========================================
        // Validate Date
        // ========================================

        if (startDate && isNaN(Date.parse(startDate))) {

            return res.status(400).json({

                success: false,

                message: "start_date ไม่ถูกต้อง"

            });

        }


        if (endDate && isNaN(Date.parse(endDate))) {

            return res.status(400).json({

                success: false,

                message: "end_date ไม่ถูกต้อง"

            });

        }


        if (
            startDate &&
            endDate &&
            startDate > endDate
        ) {

            return res.status(400).json({

                success: false,

                message: "start_date ต้องไม่มากกว่า end_date"

            });

        }


        // ========================================
        // Get Summary
        // ========================================

        const summary = await getCarbonSummary({

            userId,

            startDate,

            endDate

        });


        return res.status(200).json({

            success: true,

            data: summary

        });

    } catch (error) {

        console.error(
            "Carbon summary error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "ไม่สามารถดึงข้อมูลสรุป Carbon Footprint ได้",

            error: error.message

        });

    }

};

module.exports = {
    calculate,
    getSummary
};
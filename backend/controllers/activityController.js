const {
    Activity,
    EmissionFactor,
    CarbonCalculation,
    Material,
    Scope,
    ScopeCategory,
    ActivityType
} = require("../models");

const sequelize = require("../config/database");

const {
    calculateCarbonFootprint
} = require("../services/carbonCalculationService");

const createActivity = async (req, res) => {
    try {
        console.log("📦 Payload from React:", req.body);
        const {
    name,
    scope_id,
    category_id,
    activity_type_id,
    material_id,
    supplier_id,
    activity_date,
    quantity,
    unit,
    description,
    data_source
} = req.body;
const user_id = req.user.id;

        // ========================================
        // Validate required fields
        // ========================================

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "กรุณาระบุชื่อกิจกรรม"
        });
}

        if (!scope_id) {
            return res.status(400).json({
                success: false,
                message: "กรุณาระบุ scope_id"
            });
        }

        if (!category_id) {
            return res.status(400).json({
                success: false,
                message: "กรุณาระบุ category_id"
            });
        }

        if (!activity_type_id) {
            return res.status(400).json({
                success: false,
                message: "กรุณาระบุ activity_type_id"
            });
        }

        if (!material_id) {
            return res.status(400).json({
                success: false,
                message: "กรุณาระบุ material_id"
            });
        }

        if (!activity_date) {
            return res.status(400).json({
                success: false,
                message: "กรุณาระบุ activity_date"
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

        if (!unit) {
            return res.status(400).json({
                success: false,
                message: "กรุณาระบุ unit"
            });
        }

        // ========================================
        // Find Active Emission Factor
        // ========================================

        const emissionFactor = await EmissionFactor.findOne({
            where: {
                material_id: material_id,
                status: "ACTIVE"
            },
            order: [
                ["priority", "ASC"],
                ["id", "DESC"]
            ]
        });

        if (!emissionFactor) {
            return res.status(404).json({
                success: false,
                message: "ไม่พบ Emission Factor ที่ใช้งานสำหรับ Material นี้"
            });
        }

        // ========================================
        // Check Unit
        // ========================================

        if (
            emissionFactor.unit &&
            unit !== emissionFactor.unit
        ) {
            return res.status(400).json({
                success: false,
                message: "หน่วยของ Activity ไม่ตรงกับ Emission Factor",
                data: {
                    input_unit: unit,
                    emission_factor_unit: emissionFactor.unit
                }
            });
        }

        // ========================================
        // Calculate Carbon Footprint
        // ========================================

        const calculation = calculateCarbonFootprint({
            quantity: Number(quantity),
            emissionFactor: emissionFactor
        });

        // ========================================
        // Create Activity
        // ========================================

        const activity = await Activity.create({
            user_id,
            name: name.trim(),
            scope_id,
            category_id,
            activity_type_id,
            material_id,
            supplier_id: supplier_id || null,
            activity_date,
            quantity: Number(quantity),
            unit,
            description: description || null,
            data_source: data_source || "OTHER",
            status: "DRAFT"
        });

        // ========================================
        // Create Carbon Calculation
        // ========================================

        const carbonCalculation = await CarbonCalculation.create({
            activity_id: activity.id,
            emission_factor_id: emissionFactor.id,
            quantity: Number(quantity),
            factor_value: calculation.emission_factor,
            co2_result: 0,
            ch4_result: 0,
            n2o_result: 0,
            total_co2e: calculation.total_co2e,
            calculation_type: "EMISSION",
            calculation_method: "ACTIVITY_BASED"
        });

        // ========================================
        // Response
        // ========================================

        return res.status(201).json({
            success: true,
            message: "บันทึก Activity และคำนวณ Carbon Footprint สำเร็จ",

            data: {
                activity: {
                    id: activity.id,
                    user_id: activity.user_id,
                    scope_id: activity.scope_id,
                    category_id: activity.category_id,
                    activity_type_id: activity.activity_type_id,
                    material_id: activity.material_id,
                    activity_date: activity.activity_date,
                    quantity: activity.quantity,
                    unit: activity.unit,
                    description: activity.description,
                    data_source: activity.data_source,
                    status: activity.status
                },

                calculation: {
                    id: carbonCalculation.id,
                    emission_factor_id: emissionFactor.id,
                    emission_factor: calculation.emission_factor,
                    quantity: calculation.quantity,
                    total_co2e: calculation.total_co2e,
                    co2e_unit: "kgCO2e",
                    calculation_type: "EMISSION",
                    calculation_method: "ACTIVITY_BASED"
                }
            }
        });

    } catch (error) {

        console.error(
            "Create activity and carbon calculation error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "เกิดข้อผิดพลาดในการบันทึก Activity และคำนวณ Carbon Footprint",
            error: error.message
        });
    }
};

// ========================================
// GET /api/activities
// Get all activities
// ========================================

// ========================================
// GET /api/activities
// Get all activities (Filtered by user_id)
// ========================================

const getActivities = async (req, res) => {
    try {
        // ดึง user_id จาก token ที่ middleware แนบมาให้
        const user_id = req.user.id;

        const activities = await Activity.findAll({
            // เพิ่มเงื่อนไขให้ดึงเฉพาะข้อมูลที่ user_id ตรงกับคนที่ล็อกอิน
            where: {
                user_id: user_id
            },
            include: [
                {
                    model: Material,
                    as: "material",
                    attributes: ["id", "code", "name", "default_unit"]
                },
                {
                    model: Scope,
                    as: "scope",
                    attributes: ["id", "code", "name"]
                },
                {
                    model: ScopeCategory,
                    as: "category",
                    attributes: ["id", "code", "name"]
                },
                {
                    model: ActivityType,
                    as: "activityType",
                    attributes: ["id", "category_id", "code", "name", "default_unit", "calculation_method"]
                },
                {
                    model: CarbonCalculation,
                    as: "calculations",
                    attributes: [
                        "id",
                        "emission_factor_id",
                        "quantity",
                        "factor_value",
                        "co2_result",
                        "ch4_result",
                        "n2o_result",
                        "total_co2e",
                        "calculation_type",
                        "calculation_method",
                        "calculated_at"
                    ]
                }
            ],
            order: [
                ["activity_date", "DESC"],
                ["id", "DESC"]
            ]
        });

        return res.status(200).json({
            success: true,
            count: activities.length,
            data: activities
        });

    } catch (error) {
        console.error("Get activities error:", error);

        return res.status(500).json({
            success: false,
            message: "ไม่สามารถดึงข้อมูล Activity ได้",
            error: error.message
        });
    }
};



// ========================================
// GET /api/activities/:id
// Get activity by ID
// ========================================

const getActivityById = async (req, res) => {

    try {

        const { id } = req.params;

        const activity = await Activity.findByPk(id, {

            include: [
                {
                    model: CarbonCalculation,
                    as: "calculations",

                    attributes: [
                        "id",
                        "emission_factor_id",
                        "quantity",
                        "factor_value",
                        "co2_result",
                        "ch4_result",
                        "n2o_result",
                        "total_co2e",
                        "calculation_type",
                        "calculation_method",
                        "calculated_at"
                    ]
                }
            ]

        });

        if (!activity) {

            return res.status(404).json({

                success: false,

                message: "ไม่พบ Activity ที่ต้องการ"

            });

        }

        return res.status(200).json({

            success: true,

            data: activity

        });

    } catch (error) {

        console.error(
            "Get activity error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "ไม่สามารถดึงข้อมูล Activity ได้",

            error: error.message

        });

    }

};

const deleteActivity = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const userRole = req.user.role?.name || req.user.role; // เช็คบทบาทผู้ใช้งาน

        // 🛑 เช็คสิทธิ์: หากไม่ใช่ ADMIN ห้ามลบ
        if (String(userRole).toUpperCase() !== 'ADMIN') {
            await transaction.rollback();
            return res.status(403).json({
                success: false,
                message: "คุณไม่มีสิทธิ์ลบกิจกรรมนี้ (เฉพาะ Admin เท่านั้น)"
            });
        }

        // ค้นหากิจกรรม
        const activity = await Activity.findByPk(id);
        if (!activity) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "ไม่พบกิจกรรมที่ต้องการลบ"
            });
        }

        // ลบข้อมูลคำนวณ Carbon ที่เกี่ยวข้องก่อน (ถ้าไม่มี Cascade Delete ใน DB)
        await CarbonCalculation.destroy({
            where: { activity_id: id },
            transaction
        });

        // ลบ ตัว Activity
        await activity.destroy({ transaction });

        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: "ลบกิจกรรมเรียบร้อยแล้ว"
        });

    } catch (error) {
        await transaction.rollback();
        console.error("Delete activity error:", error);
        return res.status(500).json({
            success: false,
            message: "เกิดข้อผิดพลาดในการลบกิจกรรม",
            error: error.message
        });
    }
};

const updateActivity = async (req, res) => {

    const transaction = await sequelize.transaction();

    try {

        const { id } = req.params;

        const {
            
            scope_id,
            category_id,
            activity_type_id,
            material_id,
            supplier_id,
            activity_date,
            quantity,
            unit,
            description,
            data_source
        } = req.body || {};
        const user_id = req.user.id;

        // ========================================
        // Find Activity
        // ========================================

        const activity = await Activity.findByPk(id, {
            transaction
        });

        if (!activity) {

            await transaction.rollback();

            return res.status(404).json({
                success: false,
                message: "ไม่พบ Activity ที่ต้องการแก้ไข"
            });

        }


        // ========================================
        // Validate Required Fields
        // ========================================

       

        if (!scope_id) {
            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: "กรุณาระบุ scope_id"
            });
        }

        if (!category_id) {
            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: "กรุณาระบุ category_id"
            });
        }

        if (!activity_type_id) {
            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: "กรุณาระบุ activity_type_id"
            });
        }

        if (!material_id) {
            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: "กรุณาระบุ material_id"
            });
        }

        if (!activity_date) {
            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: "กรุณาระบุ activity_date"
            });
        }

        if (quantity === undefined || quantity === null) {
            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: "กรุณาระบุ quantity"
            });
        }

        if (isNaN(Number(quantity))) {
            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: "quantity ต้องเป็นตัวเลข"
            });
        }

        if (Number(quantity) < 0) {
            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: "quantity ต้องไม่ติดลบ"
            });
        }

        if (!unit) {
            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: "กรุณาระบุ unit"
            });
        }


        // ========================================
        // Find Active Emission Factor
        // ========================================

        const emissionFactor = await EmissionFactor.findOne({

            where: {
                material_id: material_id,
                status: "ACTIVE"
            },

            order: [
                ["priority", "ASC"],
                ["id", "DESC"]
            ],

            transaction

        });


        if (!emissionFactor) {

            await transaction.rollback();

            return res.status(404).json({
                success: false,
                message: "ไม่พบ Emission Factor ที่ใช้งานสำหรับ Material นี้"
            });

        }


        // ========================================
        // Check Unit
        // ========================================

        if (
            emissionFactor.unit &&
            unit !== emissionFactor.unit
        ) {

            await transaction.rollback();

            return res.status(400).json({

                success: false,

                message: "หน่วยของ Activity ไม่ตรงกับ Emission Factor",

                data: {
                    input_unit: unit,
                    emission_factor_unit: emissionFactor.unit
                }

            });

        }


        // ========================================
        // Calculate Carbon Footprint
        // ========================================

        const calculation = calculateCarbonFootprint({

            quantity: Number(quantity),

            emissionFactor: emissionFactor

        });


        // ========================================
        // Update Activity
        // ========================================

        await activity.update({

            user_id,
            scope_id,
            category_id,
            activity_type_id,
            material_id,
            supplier_id: supplier_id || null,
            activity_date,
            quantity: Number(quantity),
            unit,
            description: description || null,
            data_source: data_source || "OTHER"

        }, {
            transaction
        });


        // ========================================
        // Find Existing Carbon Calculation
        // ========================================

        let carbonCalculation = await CarbonCalculation.findOne({

            where: {
                activity_id: activity.id
            },

            order: [
                ["id", "DESC"]
            ],

            transaction

        });


        // ========================================
        // Update Existing Calculation
        // ========================================

        if (carbonCalculation) {

            await carbonCalculation.update({

                emission_factor_id: emissionFactor.id,

                quantity: Number(quantity),

                factor_value: calculation.emission_factor,

                co2_result: 0,

                ch4_result: 0,

                n2o_result: 0,

                total_co2e: calculation.total_co2e,

                calculation_type: "EMISSION",

                calculation_method: "ACTIVITY_BASED"

            }, {
                transaction
            });

        }

        // ========================================
        // Create Calculation if None Exists
        // ========================================

        else {

            carbonCalculation =
                await CarbonCalculation.create({

                    activity_id: activity.id,

                    emission_factor_id: emissionFactor.id,

                    quantity: Number(quantity),

                    factor_value: calculation.emission_factor,

                    co2_result: 0,

                    ch4_result: 0,

                    n2o_result: 0,

                    total_co2e: calculation.total_co2e,

                    calculation_type: "EMISSION",

                    calculation_method: "ACTIVITY_BASED"

                }, {
                    transaction
                });

        }


        // ========================================
        // Commit Transaction
        // ========================================

        await transaction.commit();


        // ========================================
        // Response
        // ========================================

        return res.status(200).json({

            success: true,

            message: "แก้ไข Activity และคำนวณ Carbon Footprint สำเร็จ",

            data: {

                activity: {

                    id: activity.id,

                    user_id: activity.user_id,

                    scope_id: activity.scope_id,

                    category_id: activity.category_id,

                    activity_type_id: activity.activity_type_id,

                    material_id: activity.material_id,

                    supplier_id: activity.supplier_id,

                    activity_date: activity.activity_date,

                    quantity: activity.quantity,

                    unit: activity.unit,

                    description: activity.description,

                    data_source: activity.data_source,

                    status: activity.status

                },

                calculation: {

                    id: carbonCalculation.id,

                    emission_factor_id: emissionFactor.id,

                    emission_factor:
                        calculation.emission_factor,

                    quantity:
                        calculation.quantity,

                    total_co2e:
                        calculation.total_co2e,

                    co2e_unit: "kgCO2e",

                    calculation_type: "EMISSION",

                    calculation_method: "ACTIVITY_BASED"

                }

            }

        });

    } catch (error) {

        await transaction.rollback();

        console.error(
            "Update activity error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "ไม่สามารถแก้ไข Activity ได้",

            error: error.message

        });

    }

};

module.exports = {
    createActivity,
    getActivities,
    getActivityById,
    deleteActivity,
    updateActivity
};

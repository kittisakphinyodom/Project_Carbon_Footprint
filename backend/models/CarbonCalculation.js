const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CarbonCalculation = sequelize.define(
    "CarbonCalculation",
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        activity_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },

        emission_factor_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },

        quantity: {
            type: DataTypes.DECIMAL(20, 6),
            allowNull: false
        },

        factor_value: {
            type: DataTypes.DECIMAL(20, 12),
            allowNull: false
        },

        co2_result: {
            type: DataTypes.DECIMAL(20, 12),
            allowNull: true
        },

        ch4_result: {
            type: DataTypes.DECIMAL(20, 12),
            allowNull: true
        },

        n2o_result: {
            type: DataTypes.DECIMAL(20, 12),
            allowNull: true
        },

        total_co2e: {
            type: DataTypes.DECIMAL(20, 12),
            allowNull: false
        },

        calculation_type: {
            type: DataTypes.ENUM(
                "EMISSION",
                "REMOVAL"
            ),
            defaultValue: "EMISSION"
        },

        calculation_method: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        calculated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: "carbon_calculations",
        timestamps: false
    }
);

module.exports = CarbonCalculation;
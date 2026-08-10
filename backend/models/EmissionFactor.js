const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const EmissionFactor = sequelize.define(
    "EmissionFactor",
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        source_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },

        version_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },

        scope_id: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: true
        },

        category_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true
        },

        activity_type_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true
        },

        material_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true
        },

        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        unit: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        co2_factor: {
            type: DataTypes.DECIMAL(20, 12),
            allowNull: true
        },

        ch4_factor: {
            type: DataTypes.DECIMAL(20, 12),
            allowNull: true
        },

        n2o_factor: {
            type: DataTypes.DECIMAL(20, 12),
            allowNull: true
        },

        total_co2e_factor: {
            type: DataTypes.DECIMAL(20, 12),
            allowNull: false
        },

        emission_type: {
            type: DataTypes.ENUM(
                "FOSSIL",
                "BIOGENIC",
                "REMOVAL",
                "OTHER"
            ),
            defaultValue: "FOSSIL"
        },

        reference: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        reference_year: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        valid_from: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        valid_to: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        priority: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },

        status: {
            type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        }
    },
    {
        tableName: "emission_factors",
        timestamps: false
    }
);

module.exports = EmissionFactor;
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Activity = sequelize.define(
    "Activity",
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        user_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },

        scope_id: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false
        },

        category_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },

        activity_type_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },

        material_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true
        },

        supplier_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true
        },

        activity_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        quantity: {
            type: DataTypes.DECIMAL(20, 6),
            allowNull: false
        },

        unit: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        data_source: {
            type: DataTypes.ENUM(
                "INVOICE",
                "METER",
                "RECEIPT",
                "SUPPLIER",
                "ESTIMATE",
                "OTHER"
            ),
            defaultValue: "OTHER"
        },

        status: {
            type: DataTypes.ENUM(
                "DRAFT",
                "SUBMITTED",
                "APPROVED",
                "REJECTED"
            ),
            defaultValue: "DRAFT"
        },

        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },

        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: "activities",
        timestamps: false
    }
);

module.exports = Activity;
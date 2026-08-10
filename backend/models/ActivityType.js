const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ActivityType = sequelize.define(
    "ActivityType",
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        category_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },

        code: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        default_unit: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        calculation_method: {
            type: DataTypes.ENUM(
                "ACTIVITY_BASED",
                "MASS_BASED",
                "ENERGY_BASED",
                "DISTANCE_BASED",
                "SPEND_BASED",
                "OTHER"
            ),
            defaultValue: "ACTIVITY_BASED"
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        status: {
            type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
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
        tableName: "activity_types",
        timestamps: false
    }
);

module.exports = ActivityType;
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Material = sequelize.define(
    "Material",
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
            allowNull: false,
            unique: true
        },

        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        default_unit: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        status: {
            type: DataTypes.ENUM(
                "ACTIVE",
                "INACTIVE"
            ),
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
        tableName: "materials",
        timestamps: false
    }
);

module.exports = Material;
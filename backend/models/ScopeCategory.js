const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ScopeCategory = sequelize.define(
    "ScopeCategory",
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        scope_id: {
            type: DataTypes.TINYINT.UNSIGNED,
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
        tableName: "scope_categories",
        timestamps: false
    }
);

module.exports = ScopeCategory;
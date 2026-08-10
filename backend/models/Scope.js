const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Scope = sequelize.define(
    "Scope",
    {
        id: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        code: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },

        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
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
        tableName: "scopes",
        timestamps: false
    }
);

module.exports = Scope;
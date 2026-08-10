const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        role_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },

        username: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },

        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        first_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        last_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        email: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true
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
        tableName: "users",
        timestamps: false
    }
);

module.exports = User;
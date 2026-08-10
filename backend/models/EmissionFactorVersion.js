const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const EmissionFactorVersion = sequelize.define(
    "EmissionFactorVersion",
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        source_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },

        version_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        version_code: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        publication_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        effective_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        document_name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        document_url: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        status: {
            type: DataTypes.ENUM(
                "DRAFT",
                "ACTIVE",
                "INACTIVE"
            ),
            defaultValue: "ACTIVE"
        }
    },
    {
        tableName: "emission_factor_versions",
        timestamps: false
    }
);

module.exports = EmissionFactorVersion;
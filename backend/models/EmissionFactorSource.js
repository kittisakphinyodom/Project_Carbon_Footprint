const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const EmissionFactorSource = sequelize.define(
    "EmissionFactorSource",
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        organization: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        url: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        reference_document: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        reference_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        tableName: "emission_factor_sources",
        timestamps: false
    }
);

module.exports = EmissionFactorSource;
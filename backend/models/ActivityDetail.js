// backend/models/ActivityDetail.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ActivityDetail = sequelize.define(
  "ActivityDetail",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    activity_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    scope_id: { type: DataTypes.INTEGER, allowNull: true },
    category_id: { type: DataTypes.INTEGER, allowNull: true },
    activity_type_id: { type: DataTypes.INTEGER, allowNull: true },
    material_id: { type: DataTypes.INTEGER, allowNull: true },
    quantity: { type: DataTypes.DECIMAL(12, 4), allowNull: true },
    unit: { type: DataTypes.STRING(50), allowNull: true },
    carbon_footprint: { type: DataTypes.DECIMAL(12, 4), allowNull: true }
  },
  {
    tableName: "activity_details", // ⚠️ ต้องระบุชื่อตารางตรงนี้ให้ตรงกับใน MySQL เป๊ะๆ
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

module.exports = ActivityDetail;
// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/database");

// const Activity = sequelize.define(
//     "Activity",
//     {
//         id: {
//             type: DataTypes.BIGINT.UNSIGNED,
//             primaryKey: true,
//             autoIncrement: true
//         },
        
//         name: {
//             type: DataTypes.STRING(255),
//             allowNull: false
//         },  

//         user_id: {
//             type: DataTypes.INTEGER.UNSIGNED,
//             allowNull: false
//         },

//         scope_id: {
//             type: DataTypes.TINYINT.UNSIGNED,
//             allowNull: true
//         },

//         category_id: {
//             type: DataTypes.INTEGER.UNSIGNED,
//             allowNull:  true
//         },

//         activity_type_id: {
//             type: DataTypes.INTEGER.UNSIGNED,
//             allowNull: true
//         },

//         material_id: {
//             type: DataTypes.INTEGER.UNSIGNED,
//             allowNull: true
//         },

//         supplier_id: {
//             type: DataTypes.INTEGER.UNSIGNED,
//             allowNull: true
//         },

//         activity_date: {
//             type: DataTypes.DATEONLY,
//             allowNull: false
//         },

//         quantity: {
//             type: DataTypes.DECIMAL(20, 6),
//             allowNull: true
//         },

//         unit: {
//             type: DataTypes.STRING(50),
//             allowNull: true
//         },

//         description: {
//             type: DataTypes.TEXT,
//             allowNull: true
//         },

//         data_source: {
//             type: DataTypes.ENUM(
//                 "INVOICE",
//                 "METER",
//                 "RECEIPT",
//                 "SUPPLIER",
//                 "ESTIMATE",
//                 "OTHER"
//             ),
//             defaultValue: "OTHER"
//         },

//         status: {
//             type: DataTypes.ENUM(
//                 "DRAFT",
//                 "SUBMITTED",
//                 "APPROVED",
//                 "REJECTED"
//             ),
//             defaultValue: "DRAFT"
//         },

//         created_at: {
//             type: DataTypes.DATE,
//             defaultValue: DataTypes.NOW
//         },

//         updated_at: {
//             type: DataTypes.DATE,
//             defaultValue: DataTypes.NOW
//         }
//     },
//     {
//         tableName: "activities",
//         timestamps: false
//     }
// );

// module.exports = Activity;

// backend/models/Activity.js
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    activity_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    data_source: {
      type: DataTypes.ENUM('INVOICE','METER','RECEIPT','SUPPLIER','ESTIMATE','OTHER'),
      allowNull: true,
      defaultValue: "OTHER"
    },
    status: {
      type: DataTypes.ENUM('DRAFT','SUBMITTED','APPROVED','REJECTED'),
      allowNull: true,
      defaultValue: "DRAFT"
    },
    // ฟิลด์เดิม ปรับเป็น allowNull: true ให้ตรงกับ MySQL ล่าสุด
    scope_id: { type: DataTypes.INTEGER, allowNull: true },
    category_id: { type: DataTypes.INTEGER, allowNull: true },
    activity_type_id: { type: DataTypes.INTEGER, allowNull: true },
    material_id: { type: DataTypes.INTEGER, allowNull: true },
    supplier_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    quantity: { type: DataTypes.DECIMAL(12, 4), allowNull: true },
    unit: { type: DataTypes.STRING(50), allowNull: true }
  },
  {
    tableName: "activities",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

module.exports = Activity;

// ========================================
// Import Models
// ========================================

const Role = require("./Role");
const User = require("./User");

const Scope = require("./Scope");
const ScopeCategory = require("./ScopeCategory");
const ActivityType = require("./ActivityType");
const Material = require("./Material");

const EmissionFactor = require("./EmissionFactor");
const EmissionFactorSource = require("./EmissionFactorSource");
const EmissionFactorVersion = require("./EmissionFactorVersion");

const Activity = require("./Activity");
const CarbonCalculation = require("./CarbonCalculation");


// ========================================
// User Relationships
// ========================================

Role.hasMany(User, {
    foreignKey: "role_id",
    as: "users"
});

User.belongsTo(Role, {
    foreignKey: "role_id",
    as: "role"
});


// ========================================
// Scope Relationships
// ========================================

Scope.hasMany(ScopeCategory, {
    foreignKey: "scope_id",
    as: "categories"
});

ScopeCategory.belongsTo(Scope, {
    foreignKey: "scope_id",
    as: "scope"
});


// ========================================
// Activity Type Relationships
// ========================================

ScopeCategory.hasMany(ActivityType, {
    foreignKey: "category_id",
    as: "activityTypes"
});

ActivityType.belongsTo(ScopeCategory, {
    foreignKey: "category_id",
    as: "category"
});


// ========================================
// Emission Factor Relationships
// ========================================

EmissionFactorSource.hasMany(EmissionFactorVersion, {
    foreignKey: "source_id",
    as: "versions"
});

EmissionFactorVersion.belongsTo(EmissionFactorSource, {
    foreignKey: "source_id",
    as: "source"
});

EmissionFactorVersion.hasMany(EmissionFactor, {
    foreignKey: "version_id",
    as: "emissionFactors"
});

EmissionFactor.belongsTo(EmissionFactorVersion, {
    foreignKey: "version_id",
    as: "version"
});

EmissionFactor.belongsTo(EmissionFactorSource, {
    foreignKey: "source_id",
    as: "source"
});

EmissionFactor.belongsTo(Scope, {
    foreignKey: "scope_id",
    as: "scope"
});

EmissionFactor.belongsTo(ScopeCategory, {
    foreignKey: "category_id",
    as: "category"
});

EmissionFactor.belongsTo(ActivityType, {
    foreignKey: "activity_type_id",
    as: "activityType"
});


// ========================================
// Activity Relationships
// ========================================

Activity.belongsTo(Scope, {
    foreignKey: "scope_id",
    as: "scope"
});

Activity.belongsTo(ScopeCategory, {
    foreignKey: "category_id",
    as: "category"
});

Activity.belongsTo(Material, {
    foreignKey: "material_id",
    as: "material"
});

Activity.hasMany(CarbonCalculation, {
    foreignKey: "activity_id",
    as: "calculations"
});
Activity.belongsTo(ActivityType, {
    foreignKey: "activity_type_id",
    as: "activityType"
});

ActivityType.hasMany(Activity, {
    foreignKey: "activity_type_id",
    as: "activities"
});

// ========================================
// Material Relationships
// ========================================

Material.hasMany(Activity, {
    foreignKey: "material_id",
    as: "activities"
});

Material.hasMany(EmissionFactor, {
    foreignKey: "material_id",
    as: "emissionFactors"
});

EmissionFactor.belongsTo(Material, {
    foreignKey: "material_id",
    as: "material"
});

// Material.belongsTo(ScopeCategory, {
//     foreignKey: "category_id",
//     as: "category"
// });
// ScopeCategory.hasMany(Material, {
//     foreignKey: "category_id",
//     as: "materials"
// });
// ========================================
// Carbon Calculation Relationships
// ========================================

CarbonCalculation.belongsTo(Activity, {
    foreignKey: "activity_id",
    as: "activity"
});

CarbonCalculation.belongsTo(EmissionFactor, {
    foreignKey: "emission_factor_id",
    as: "emissionFactor"
});
Material.belongsTo(ScopeCategory, {
    foreignKey: "category_id",
    as: "category"
});
ScopeCategory.hasMany(Material, {
    foreignKey: "category_id",
    as: "materials"
});




// ========================================
// Export Models
// ========================================

module.exports = {
    Role,
    User,

    Scope,
    ScopeCategory,
    ActivityType,
    Material,

    EmissionFactor,
    EmissionFactorSource,
    EmissionFactorVersion,

    Activity,
    CarbonCalculation
};


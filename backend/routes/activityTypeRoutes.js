const express = require("express");

const router = express.Router();

const {
    getAllActivityTypes,
    getActivityTypesByCategory,
    getActivityTypeById
} = require("../controllers/activityTypeController");


// GET /api/activity-types
router.get(
    "/",
    getAllActivityTypes
);


// GET /api/activity-types/category/:categoryId
router.get(
    "/category/:categoryId",
    getActivityTypesByCategory
);


// GET /api/activity-types/:id
router.get(
    "/:id",
    getActivityTypeById
);


module.exports = router;
const express = require("express");

const router = express.Router();

const {
    getAllActivityTypes,
    getActivityTypesByCategory,
    getActivityTypeById
} = require("../controllers/activityTypeController");

const authMiddleware = require("../middleware/authMiddleware");

// GET /api/activity-types
router.get(
    "/",
    authMiddleware,
    getAllActivityTypes
);

// GET /api/activity-types/category/:categoryId
router.get(
    "/category/:categoryId",
    authMiddleware,
    getActivityTypesByCategory
);

// GET /api/activity-types/:id
router.get(
    "/:id",
    authMiddleware,
    getActivityTypeById
);
router.get(
    "/",
    getAllActivityTypes
);
module.exports = router;
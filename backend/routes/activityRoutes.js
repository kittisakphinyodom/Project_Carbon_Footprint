const express = require("express");

const router = express.Router();

const {
    createActivity,
    getActivities,
    getActivityById,
    deleteActivity,
    updateActivity
} = require("../controllers/activityController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
// POST /api/activities
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN", "STAFF"),
    createActivity
);

// GET /api/activities
router.get(
    "/",
    authMiddleware,
    getActivities
);

// GET /api/activities/:id
router.get(
    "/:id",
    authMiddleware,
    getActivityById
);



// PUT /api/activities/:id
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN", "STAFF"),
    updateActivity
);

// DELETE /api/activities/:id
router.delete(
        "/:id",
        authMiddleware,
        roleMiddleware("ADMIN"),
        deleteActivity);


module.exports = router;
const express = require("express");

const router = express.Router();

const {
    createActivity,
    getActivities,
    getActivityById,
    deleteActivity,
    updateActivity
} = require("../controllers/activityController");

// POST /api/activities
router.post("/", createActivity);

// GET /api/activities
router.get("/", getActivities);

// GET /api/activities/:id
router.get("/:id", getActivityById);

// PUT /api/activities/:id
router.put("/:id", updateActivity);

// DELETE /api/activities/:id
router.delete("/:id", deleteActivity);


module.exports = router;
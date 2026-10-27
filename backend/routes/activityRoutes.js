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


// POST /api/activities (ADMIN และ STAFF เพิ่มกิจกรรมได้)
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN", "STAFF"),
    createActivity
);


// GET /api/activities (ดูรายการได้ทั้งหมด)
router.get(
    "/",
    authMiddleware,
    getActivities
);

// GET /api/activities/:id (ดูรายละเอียดตาม ID)
router.get(
    "/:id",
    authMiddleware,
    getActivityById
);



// PUT /api/activities/:id (แก้ไขกิจกรรม - เฉพาะ ADMIN เท่านั้น)
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"), // 
    updateActivity
);

// DELETE /api/activities/:id (ลบกิจกรรม - เฉพาะ ADMIN เท่านั้น)
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"), // 
    deleteActivity
);

// router.get("/report/summary",
//      authMiddleware,
//       roleMiddleware("MANAGER", "ADMIN"), 
//     getSummaryReport
// );


        
module.exports = router;
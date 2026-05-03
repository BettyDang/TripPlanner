const express = require("express");

const {
    createActivity,
    getActivities,
    getActivityById,
    updateActivity,
    deleteActivity
} = require("../Controllers/activityController");

const { authMiddleware } = require("../Middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/trips/:tripId/activities", createActivity);
router.post("/create", createActivity);
router.get("/trips/:tripId/activities", getActivities);
router.get("/activities/:id", getActivityById);
router.put("/activities/:id", updateActivity);
router.delete("/activities/:id", deleteActivity);

module.exports = router;
const express = require("express");
const {
    createTrip,
    getTrips,
    getTripById,
    updateTrip,
    deleteTrip
} = require("../Controllers/tripController");

const { authMiddleware } = require("../Middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createTrip);
router.get("/", getTrips);
router.get("/:id", getTripById);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);

module.exports = router;
const mongoose = require("mongoose");
const Activity = require("../Models/Activity");
const Trip = require("../Models/Trips"); 

const {
    emitActivityCreated,
    emitActivityUpdated,
    emitActivityDeleted
} = require("../socket");

// Create
const createActivity = async (req, res) => {
    try {
        const tripId = req.params.tripId || req.body.tripId;
        const { title, description, date, status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(tripId)) {
            return res.status(400).json({ message: "Invalid trip ID." });
        }

        if (!title) {
            return res.status(400).json({ message: "Title is required." });
        }

        const trip = await Trip.findById(tripId);

        if (!trip) {
            return res.status(404).json({ message: "Trip not found." });
        }

        // Link to user
        if (trip.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized." });
        }

        const activity = await Activity.create({
            title,
            description,
            date,
            status,
            tripId
        });

        emitActivityCreated(activity);

        return res.status(201).json({
            message: "Activity created successfully.",
            data: { activity }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error creating activity."
        });
    }
};


// Get all
const getActivities = async (req, res) => {
    try {
        const { tripId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(tripId)) {
            return res.status(400).json({ message: "Invalid trip ID." });
        }

        const trip = await Trip.findById(tripId);

        if (!trip) {
            return res.status(404).json({ message: "Trip not found." });
        }

        if (trip.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized." });
        }

        const activities = await Activity.find({ tripId }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Activities fetched successfully.",
            data: { activities }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error fetching activities."
        });
    }
};


// Get one
const getActivityById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid activity ID." });
        }

        const activity = await Activity.findById(id);

        if (!activity) {
            return res.status(404).json({ message: "Activity not found." });
        }

        const trip = await Trip.findById(activity.tripId);

        if (trip.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized." });
        }

        return res.status(200).json({
            message: "Activity fetched successfully.",
            data: { activity }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error fetching activity."
        });
    }
};


// Update
const updateActivity = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid activity ID." });
        }

        const activity = await Activity.findById(id);

        if (!activity) {
            return res.status(404).json({ message: "Activity not found." });
        }

        const trip = await Trip.findById(activity.tripId);

        if (trip.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized." });
        }

        const updatedActivity = await Activity.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        emitActivityUpdated(updatedActivity);

        return res.status(200).json({
            message: "Activity updated successfully.",
            data: { activity: updatedActivity }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error updating activity."
        });
    }
};


// Delete
const deleteActivity = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid activity ID." });
        }

        const activity = await Activity.findById(id);

        if (!activity) {
            return res.status(404).json({ message: "Activity not found." });
        }

        const trip = await Trip.findById(activity.tripId);

        if (trip.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized." });
        }

        await Activity.findByIdAndDelete(id);

        emitActivityDeleted(id);

        return res.status(200).json({
            message: "Activity deleted successfully."
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error deleting activity."
        });
    }
};

module.exports = {
    createActivity,
    getActivities,
    getActivityById,
    updateActivity,
    deleteActivity
};
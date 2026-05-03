const mongoose = require("mongoose");
const Trip = require("../Models/Trips");

const { 
    emitTripCreated, 
    emitTripUpdated, 
    emitTripDeleted 
} = require("../socket");

const createTrip = async (req, res) => {
    try {
        const { title, destination, startDate, endDate, image} = req.body;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized"});
        }
        if (!title || !destination) {
            return res.status(400).json({ message: "Title and destination are required!"});
        }

        const trip = await Trip.create({
            title,
            destination,
            startDate,
            endDate,
            image,
            userId: req.user.id
        });

        emitTripCreated(trip);

        console.log("USER:", req.user);

        return res.status(201).json({
            message: "Trip created successfully",
            data: { trip }
        });
    } catch (error) {
         console.log(error);
         return res.status(500).json({
            message: "Error creating trip"
         });
    }
};

// Get all Trips
const getTrips = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized." });
        }

        const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Trips fetched successfully.",
            data: { trips }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching trips." });
    }
};

// get one trip
const getTripById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid trip ID." });
        }

        const trip = await Trip.findById(id);

        if (!trip) {
            return res.status(404).json({ message: "Trip not found." });
        }

        return res.status(200).json({
            message: "Trip fetched successfully.",
            data: { trip }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching trip." });
    }
};

// Update trip
const updateTrip = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid trip ID." });
        }

        const updatedTrip = await Trip.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        emitTripUpdated(updatedTrip);

        return res.status(200).json({
            message: "Trip updated successfully.",
            data: { trip: updatedTrip }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error updating trip." });
    }
};

// delete trip
const deleteTrip = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid trip ID." });
        }

        const trip = await Trip.findByIdAndDelete(id);

        emitTripDeleted(id);

        return res.status(200).json({
            message: "Trip deleted successfully.",
            data: { trip }
        });

    } catch (error) {
        console.log("CREATE TRIP ERROR:", error);

        console.log(error);
        return res.status(500).json({ message: "Error deleting trip." });
    }
};

module.exports = {
    createTrip,
    getTrips,
    getTripById,
    updateTrip,
    deleteTrip
};

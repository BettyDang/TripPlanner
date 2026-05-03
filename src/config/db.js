const mongoose = require("mongoose");

const connectDB = async () => {
    //const mongoUri = "mongodb+srv://TripDB:w81gKwOUw20y5K72@trip.kgjxaox.mongodb.net/?appName=Trip";
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error("MONGO_URI is not defined in environment variables.");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully.");
};

module.exports = { connectDB };
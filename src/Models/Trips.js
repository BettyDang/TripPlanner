const mongoose = require("mongoose")

const tripSchema =  new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    title: {
        type: String,
        require: true
    },
    destination: {
        type: String,
        require: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    image: {
        type: String   // URL or file path
    }
    },
    {
        timestamps: true 
    });


module.exports = mongoose.model("Trip", tripSchema);
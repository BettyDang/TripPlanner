const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        require: true
    },
    title: {
        type: String,
        require: true
    },
    description: {
        type: String
    },
    date: {
        type: Date
    },
    Status: {
        type: String,
        enum: [ "Planned", "Pending", "Completed"],
        default: "Planned"
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Activity", activitySchema);
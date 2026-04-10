const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            requires: true,
            trim: true
        },
        email: {
            type: String,
            requires: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            requires: true,
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
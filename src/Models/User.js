const moongoose = require("mongoose");

const UserShecma = new mongoose.Schema(
    {
        name: String,
        email: {
            type: String,
            unique: true,
            password: String
        }
    }

);

const User = moongoose.model("User", UserShecma);

module.exports = User;
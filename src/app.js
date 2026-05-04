const express = require("express");
const cors = require("cors");
const authRoutes = require("./Routes/authRoutes");
const tripRoutes = require("./Routes/tripRoutes");
const activityRoutes = require("./Routes/activityRoutes");

const app = express();

//app.use(cors());

app.use(cors({
    origin: [
    "http://localhost:4200",
    "https://tripplanner-1-e9wr.onrender.com",
    "https://tripplanner-cutk.onrender.com"
    ]
  }));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/trips", tripRoutes);
app.use("/activity", activityRoutes);


app.get("/", (req, res) => {
    res.send("Trip Planner API is running");
});


module.exports = app;
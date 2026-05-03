const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.on("connection", (socket) => {
        socket.emit("socket:ready", {
            message: "WebSocket connection established."
        });
    });

    return io;
};

// TRIP EVENTS
const emitTripCreated = (trip) => {
    if (!io) return;
    io.emit("trip:created", trip);
};

const emitTripUpdated = (trip) => {
    if (!io) return;
    io.emit("trip:updated", trip);
};

const emitTripDeleted = (tripId) => {
    if (!io) return;
    io.emit("trip:deleted", { tripId });
};

// ACTIVITY EVENTS
const emitActivityCreated = (activity) => {
    if (!io) return;

    io.emit("activity:created", {
        message: "Activity created successfully.",
        data: activity
    });
};

const emitActivityUpdated = (activity) => {
    if (!io) return;

    io.emit("activity:updated", {
        message: "Activity updated successfully.",
        data: activity
    });
};

const emitActivityDeleted = (activityId) => {
    if (!io) return;

    io.emit("activity:deleted", {
        message: "Activity deleted successfully.",
        data: { activityId }
    });
};

module.exports = {
    initializeSocket,
    emitTripCreated,
    emitTripUpdated,
    emitTripDeleted,
    emitActivityCreated,
    emitActivityUpdated,
    emitActivityDeleted
};
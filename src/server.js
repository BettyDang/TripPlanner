const path = require("path");
const http = require("http");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const { connectDB } = require("./config/db");
const app = require("./app");
const { initializeSocket } = require("./socket");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Create HTTP server (IMPORTANT for sockets)
        const server = http.createServer(app);

        // Initialize Socket.IO
        initializeSocket(server);

        // Start server
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
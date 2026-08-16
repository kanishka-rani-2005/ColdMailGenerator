const app = require("../server");
const connectDB = require("../config/db");

let isConnected = false;

module.exports = async (req, res) => {
    try {
        if (!isConnected) {
            await connectDB();
            isConnected = true;
        }

        return app(req, res);

    } catch (error) {
        console.error("MongoDB connection error:", error);

        return res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: error.message
        });
    }
};
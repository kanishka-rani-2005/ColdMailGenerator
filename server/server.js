const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());

const allowedOrigins = [
    "https://cold-mail-generator-hwc8-hkjk0sj2d-krani-be23-9326s-projects.vercel.app",
    "http://localhost:5173"
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }
            callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        success: false,
        message: "Something went wrong"
    });
});

if (require.main === module) {
    const PORT = process.env.PORT || 3000;

    connectDB()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        })
        .catch((error) => {
            console.error("MongoDB connection failed:", error);
            process.exit(1);
        });
}

module.exports = app;
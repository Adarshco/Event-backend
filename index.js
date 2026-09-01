import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "dns";

import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ===============================
// CORS
// ===============================

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5176",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin
            // (Postman, server-to-server, etc.)
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error("Not allowed by CORS")
            );
        },
        credentials: true
    })
);

// ===============================
// MONGODB
// ===============================

let isConnected = false;

async function connectToDatabase() {
    if (isConnected && mongoose.connection.readyState === 1) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);

        isConnected = true;

        console.log("MongoDB Connected Successfully");
    } catch (error) {
        isConnected = false;

        console.error("MongoDB Connection Error:", error);

        throw error;
    }
}

// Connect DB before processing API request
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

// ===============================
// ROUTES
// ===============================

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Event Backend API is running"
    });
});

// ===============================
// VERCEL
// ===============================

export default app;

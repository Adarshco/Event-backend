import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";

import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";

import Application from "./models/application.model.js";
import Job from "./models/job.model.js";
import applicationRoute from "./routes/application.route.js";

import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: "http://localhost:5176",
    credentials: true
};


let isConnected = false;

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        isConnected = true;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

// add middleware

app.use((req, res, next) => {
    if (!isConnected) {
        connectToDatabase();
    }
    next();
});


app.use(cors(corsOptions));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// const PORT = process.env.PORT || 3000; 
// app.listen(PORT, () => {
//     console.log(`Server running at port ${PORT}`);
// });


// do not use app.listen() in vercel
module.exports = app;
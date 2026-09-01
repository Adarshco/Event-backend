import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";

import {
    getAdminJobs,
    getAllJobs,
    getJobById,
    postJob
} from "../controllers/job.controller.js";

const router = express.Router();

// Recruiter must be logged in to post a job
router.route("/post").post(isAuthenticated, postJob);

// Public routes
router.route("/get").get(getAllJobs);
router.route("/get/:id").get(getJobById);

// Recruiter must be logged in
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);

export default router;

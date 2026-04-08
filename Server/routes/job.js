// backend/routes/job.js
import express from "express";
import { createJob, getJobs, reportJob, applyToJob, getMyApplications, toggleSaveJob, getSavedJobs, getProviderJobs, updateApplicationStatus } from "../controllers/jobcontroller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();
 
router.post("/", authenticate, createJob);
router.get("/my-applications", authenticate, getMyApplications);
router.get("/saved", authenticate, getSavedJobs);
router.post("/save/:id", authenticate, toggleSaveJob);
router.get("/provider/jobs", authenticate, getProviderJobs);
router.put("/application/status", authenticate, updateApplicationStatus);
router.get("/ping", (req, res) => res.json({ msg: "Tactical Job Route Operational" }));
router.get("/", getJobs);
router.post("/report/:id", authenticate, reportJob);
router.post("/apply/:id", authenticate, applyToJob); 
 
export default router;

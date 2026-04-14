// backend/routes/job.js
import express from "express";
import { 
  createJob, getJobs, reportJob, applyToJob, 
  getMyApplications, toggleSaveJob, getSavedJobs, 
  getProviderJobs, updateApplicationStatus, 
  getJobApplicants, getRecommendations 
} from "../controllers/jobcontroller.js";
import { authenticate, isProvider } from "../middleware/authMiddleware.js";

const router = express.Router();
 
router.post("/", authenticate, isProvider, createJob);
router.get("/recommendations", authenticate, getRecommendations);
router.get("/my-applications", authenticate, getMyApplications);
router.get("/saved", authenticate, getSavedJobs);
router.post("/save/:id", authenticate, toggleSaveJob);
router.get("/my-jobs", authenticate, isProvider, getProviderJobs);
router.get("/provider/jobs", authenticate, isProvider, getProviderJobs);
router.get("/:id/applicants", authenticate, isProvider, getJobApplicants);
router.patch("/:jobId/applicants/:userId/status", authenticate, isProvider, updateApplicationStatus);
router.put("/application/status", authenticate, updateApplicationStatus); // Keep for legacy compat
router.get("/ping", (req, res) => res.json({ msg: "Tactical Job Route Operational" }));
router.get("/stats", async (req, res) => {
  try {
    const Job = (await import("../models/job.js")).default;
    const User = (await import("../models/user.js")).default;
    const stats = {
      totalJobs: await Job.countDocuments({ isApproved: true }),
      totalUsers: await User.countDocuments(),
      partnerCompanies: await User.countDocuments({ role: "job_provider" }),
      satisfactionRate: "98.2%" // Dynamic enough for now
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching public stats" });
  }
});
router.get("/", getJobs);
router.post("/report/:id", authenticate, reportJob);
router.post("/apply/:id", authenticate, applyToJob); 
 
export default router;

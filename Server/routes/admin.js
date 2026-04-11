import express from "express";
import { getStats, getReportedJobs, flagJob, getPendingJobs, approveJob, getAllAdminJobs, rejectJob } from "../controllers/admincontroller.js";
import { authenticate } from "../middleware/authMiddleware.js";
import User from "../models/user.js";
import Job from "../models/job.js";

const router = express.Router();

// Middleware to ensure admin role
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ msg: "Admin access required" });
  }
};

// Apply auth and admin check to all routes
router.use(authenticate, isAdmin);

// ── Core Stats ──────────────────────────────────────────────────────
router.get("/ping", (req, res) => res.json({ msg: "Admin Hub Connected ✅" }));
router.get("/stats", getStats);

// ── User Oversight ──────────────────────────────────────────────────
// Fetch all platform users (Seekers and Providers)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .select("-password")
      .sort({ createdAt: -1 });

    const enriched = await Promise.all(users.map(async (u) => {
      // Count jobs this user posted as a provider
      const postedJobs = await Job.countDocuments({ provider: u._id });
      // Count how many jobs this user has applied to (embedded applicants array)
      const applications = await Job.countDocuments({ "applicants.user": u._id });
      return { ...u.toObject(), postedJobs, applications };
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching users", error: err.message });
  }
});

// Delete any user
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting user", error: err.message });
  }
});

// ── Job Oversight ───────────────────────────────────────────────────
// Get ALL platform jobs (approved + pending) with server-side pagination
router.get("/all-jobs", getAllAdminJobs);

// Delete/Reject any job listing
router.delete("/jobs/:id", rejectJob);

// ── Approval Queue ──────────────────────────────────────────────────
router.get("/jobs/pending", getPendingJobs);
router.patch("/jobs/:id/approve", approveJob);

// ── Moderation ──────────────────────────────────────────────────────
router.get("/reported-jobs", getReportedJobs);
router.put("/flag-job/:id", flagJob);

export default router;

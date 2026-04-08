import express from "express";
import { registerUser, loginUser } from "../controllers/authcontroller.js";
import { authenticate, verifyAdmin } from "../middleware/authMiddleware.js";
import { getStats, getReportedJobs, flagJob } from "../controllers/admincontroller.js";
import User from "../models/user.js";
import Job from "../models/job.js";

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Admin Routes
router.get("/admin/stats", authenticate, verifyAdmin, getStats);
router.get("/admin/reported-jobs", authenticate, verifyAdmin, getReportedJobs);
router.put("/admin/flag-job/:id", authenticate, verifyAdmin, flagJob);

router.get("/admin/users", authenticate, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching users", error: err.message });
  }
});

router.delete("/admin/users/:id", authenticate, verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting user", error: err.message });
  }
});

router.get("/admin/jobs", authenticate, verifyAdmin, async (req, res) => {
  try {
    const jobs = await Job.find().populate("provider", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching jobs", error: err.message });
  }
});

router.delete("/admin/jobs/:id", authenticate, verifyAdmin, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ msg: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting job", error: err.message });
  }
});

// User profile route
router.get("/me", authenticate, async (req, res) => {
  try {
    // You may want to fetch the user from DB for fresh data:
    // const user = await User.findById(req.user.id).select("-password");
    // res.json(user);

    // Or just return the decoded user from the token:
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch user", error: err.message });
  }
});

export default router;
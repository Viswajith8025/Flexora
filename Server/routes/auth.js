import express from "express";
import { registerUser, loginUser } from "../controllers/authcontroller.js";
import { authenticate, verifyAdmin } from "../middleware/authMiddleware.js";
import { getStats, getReportedJobs, flagJob } from "../controllers/admincontroller.js";
import User from "../models/user.js";
import Job from "../models/job.js";
import upload from "../middleware/uploadMiddleware.js";

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
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch user", error: err.message });
  }
});

router.patch("/update-profile", authenticate, upload.single('avatar'), async (req, res) => {
  try {
    const { phone, district } = req.body;
    let { skills, age } = req.body;
    
    console.log("💾 REQ BODY RECEIVED:", req.body);
    console.log("🔍 USER ID FROM TOKEN:", req.user.id);
    
    // Safety check for age (ensure it's a number or 0)
    age = age ? parseInt(age) : 0;
    if (isNaN(age)) age = 0;
    
    // Handle skills if sent as stringified array or multiple entries
    if (typeof skills === 'string' && skills.trim() !== '') {
      try {
        skills = JSON.parse(skills);
      } catch (e) {
        skills = skills.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    const updateData = {};
    if (phone !== undefined) updateData.phone = phone;
    if (age !== undefined) updateData.age = parseInt(age) || 0;
    if (district !== undefined) updateData.district = district;
    if (skills !== undefined) updateData.skills = skills;

    if (req.file) {
      updateData.avatar = req.file.path; // Cloudinary URL
    }

    console.log("💾 ATTEMPTING DB SAVE WITH:", updateData);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ msg: "User not found" });
    
    console.log("✅ PROFILE UPDATED SUCCESSFULLY FOR:", updatedUser.email);
    res.json({ msg: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("💥 UPDATE ERROR:", err);
    res.status(500).json({ 
      msg: "Update failed", 
      error: err.message,
      details: err.errors ? Object.keys(err.errors).map(key => err.errors[key].message) : []
    });
  }
});

export default router;
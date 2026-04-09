import Job from "../models/job.js";
import User from "../models/user.js";

export const getStats = async (req, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments(),
      totalJobs: await Job.countDocuments(),
      openJobs: await Job.countDocuments({ status: "open" }),
      reportedJobs: await Job.countDocuments({ "reports.0": { $exists: true } }),
      flaggedJobs: await Job.countDocuments({ isFlagged: true }),
      newUsersLastWeek: await User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching stats", error: err.message });
  }
};

export const getReportedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ "reports.0": { $exists: true } })
      .populate("provider", "name email")
      .populate("reports.user", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching reported jobs", error: err.message });
  }
};

export const flagJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { isFlagged: true },
      { new: true }
    );
    res.json({ msg: "Job flagged successfully", job });
  } catch (err) {
    res.status(500).json({ msg: "Error flagging job", error: err.message });
  }
};

export const getPendingJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isApproved: false })
      .populate("provider", "name email")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching pending jobs", error: err.message });
  }
};

export const approveJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!job) return res.status(404).json({ msg: "Job not found" });
    
    res.json({ msg: "Job approved successfully", job });
  } catch (err) {
    res.status(500).json({ msg: "Error approving job", error: err.message });
  }
};
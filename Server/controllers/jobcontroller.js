// backend/controllers/jobcontroller.js
import Job from "../models/job.js";

export const createJob = async (req, res) => {
  try {
    const { title, description, location, date, compensation, category } = req.body;

    const newJob = new Job({
      title,
      description,
      location,
      date,
      compensation,
      category,
      provider: req.user.id, // from auth middleware
    });

    await newJob.save();
    res.status(201).json({ msg: "Job posted successfully", job: newJob });
  } catch (err) {
    res.status(500).json({ msg: "Error posting job", error: err.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};

    const jobs = await Job.find(query).populate("provider", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching jobs", error: err.message });
  }
};

export const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    // prevent duplicate application
    const hasApplied = job.applicants.some(a => a.user.toString() === req.user.id);
    if (hasApplied) {
      return res.status(400).json({ msg: "Already applied" });
    }

    job.applicants.push({ user: req.user.id });
    await job.save();

    res.json({ msg: "Applied successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Application failed", error: err.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    // Find all jobs where the user is in the applicants array
    const jobs = await Job.find({ "applicants.user": req.user.id })
      .populate("provider", "name email");
    
      // Map to return only relevant application details + job info
      const applications = jobs.map(job => {
        const myApp = job.applicants.find(a => a.user.toString() === req.user.id);
        if (!myApp) return null;
        
        return {
          jobId: job._id,
          title: job.title,
          company: job.provider?.name || "Premium Provider",
          status: myApp.status,
          appliedAt: myApp.appliedAt,
          location: job.location,
          compensation: job.compensation,
          category: job.category
        };
      }).filter(Boolean);

    res.json(applications);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching applications", error: err.message });
  }
};

export const reportJob = async (req, res) => {
  try {
    const { reason } = req.body;
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    job.reports.push({
      user: req.user.id,
      reason,
    });

    await job.save();
    res.json({ msg: "Job reported successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error reporting job", error: err.message });
  }
};

export const toggleSaveJob = async (req, res) => {
  try {
    const User = (await import("../models/user.js")).default;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const jobId = req.params.id;
    const isSaved = user.savedJobs.some((id) => id.toString() === jobId);

    if (isSaved) {
      await User.findByIdAndUpdate(req.user.id, { $pull: { savedJobs: jobId } });
      res.json({ msg: "Job removed from saved", saved: false });
    } else {
      await User.findByIdAndUpdate(req.user.id, { $addToSet: { savedJobs: jobId } });
      res.json({ msg: "Job saved successfully", saved: true });
    }
  } catch (err) {
    res.status(500).json({ msg: "Error toggling saved job", error: err.message });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const User = (await import("../models/user.js")).default;
    const user = await User.findById(req.user.id).populate("savedJobs");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user.savedJobs);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching saved jobs", error: err.message });
  }
};

export const getProviderJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ provider: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching provider jobs", error: err.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { jobId, userId, status } = req.body; // status: 'accepted' or 'rejected'
    
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    // Check if the requester is the owner
    if (job.provider.toString() !== req.user.id) {
       return res.status(403).json({ msg: "Unauthorized to manage this job" });
    }

    const applicant = job.applicants.find(a => a.user.toString() === userId);
    if (!applicant) return res.status(404).json({ msg: "Applicant not found" });

    applicant.status = status;
    await job.save();

    res.json({ msg: `Applicant status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ msg: "Error updating status", error: err.message });
  }
};

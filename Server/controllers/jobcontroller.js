import Job from "../models/job.js";
import User from "../models/user.js"; 
import { createNotification } from "./notificationController.js";

export const createJob = async (req, res) => {
  try {
    const { 
      jobTitle, title, 
      description, 
      location, 
      startDate, date,
      payRate, compensation, payType,
      jobType, category,
      requirements, estimatedHours,
      contactEmail, contactPhone 
    } = req.body;

    const newJob = new Job({
      title: title || jobTitle,
      description,
      location,
      date: date || startDate, // Legacy support
      startDate: startDate || date,
      endDate: endDate,
      compensation: compensation || payRate,
      payType: payType || "hourly",
      category: (category || jobType || "general").toLowerCase(),
      requirements,
      estimatedHours,
      contactEmail,
      contactPhone,
      provider: req.user.id,
      isApproved: false // Requires Admin Verification
    });

    await newJob.save();
    res.status(201).json({ msg: "Job posted successfully", job: newJob });
  } catch (err) {
    console.error("Create Job Error:", err);
    res.status(500).json({ msg: "Error posting job", error: err.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const { category, search, location, limit } = req.query;
    
    // Base query: Only show approved jobs
    let query = { isApproved: true };

    // Apply filters if provided
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (location && location.trim() !== "") {
      query.location = { $regex: String(location).trim(), $options: 'i' };
    }
    
    if (search && search.trim() !== "") {
      const searchTerms = String(search).trim();
      query.$or = [
        { title: { $regex: searchTerms, $options: 'i' } },
        { description: { $regex: searchTerms, $options: 'i' } }
      ];
    }

    // Execute query with optional limit
    let findQuery = Job.find(query)
      .populate({
        path: "provider",
        select: "name email avatar",
        model: "User"
      })
      .sort({ createdAt: -1 });

    if (limit && !isNaN(parseInt(limit))) {
      findQuery = findQuery.limit(parseInt(limit));
    }

    const jobs = await findQuery;
    
    // Filter out jobs where provider failed to populate (e.g. deleted user)
    const sanitizedJobs = jobs.filter(job => job.provider !== null);
    
    res.json(sanitizedJobs);
  } catch (err) {
    console.error("CRITICAL Marketplace Error:", err);
    res.status(500).json({ 
      msg: "Internal Marketplace Error", 
      error: err.message,
      name: err.name,
      stack: err.stack
    });
  }
};

export const applyToJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Guard: reject non-ObjectId strings (e.g. fallback IDs like "fb1")
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: "This is a demo listing. Sign up as a provider to post real jobs!" });
    }

    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    // prevent duplicate application
    const hasApplied = job.applicants.some(a => a.user.toString() === req.user.id);
    if (hasApplied) {
      return res.status(400).json({ msg: "Already applied" });
    }

    job.applicants.push({ user: req.user.id });
    await job.save();

    // Notify the Job Provider
    await createNotification({
      recipient: job.provider,
      sender: req.user.id,
      title: "New Application Received",
      message: `A new candidate has applied for your listing: "${job.title}"`,
      type: "application_submitted",
      jobId: job._id
    });

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
    // Providers see all their jobs, including pending ones, with populated applicant details
    const jobs = await Job.find({ provider: req.user.id })
      .populate("applicants.user", "name email phone avatar rating completedJobs")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching provider jobs", error: err.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { jobId, userId } = req.params;
    const { status } = req.body; // status: 'accepted' or 'rejected'
    
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

    // Notify the Job Seeker
    await createNotification({
      recipient: userId,
      sender: req.user.id,
      title: "Application Status Update",
      message: `Your application for "${job.title}" has been ${status}.`,
      type: "status_update",
      jobId: job._id
    });

    res.json({ msg: `Applicant status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ msg: "Error updating status", error: err.message });
  }
};

export const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("applicants.user", "name email phone avatar rating completedJobs");
    
    if (!job) return res.status(404).json({ msg: "Job not found" });

    // Security: Only provider can see applicants
    if (job.provider.toString() !== req.user.id) {
       return res.status(403).json({ msg: "Unauthorized" });
    }

    res.json(job.applicants);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching applicants", error: err.message });
  }
};

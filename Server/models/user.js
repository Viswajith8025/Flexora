// models/user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["user", "provider", "admin", "job_seeker", "job_provider"], default: "job_seeker" },
  // Add any additional fields you need
  completedJobs: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  avatar: String,
  phone: { type: String, default: "Not provided" },
  age: { type: Number, default: 0 },
  district: { type: String, default: "Not specified" },
  freePostingsUsed: { type: Number, default: 0 },
  totalPaidPostings: { type: Number, default: 0 },
  skills: { type: [String], default: [] },
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }]
});

export default mongoose.models.User || mongoose.model("User", userSchema);
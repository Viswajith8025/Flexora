// models/user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["user", "provider", "admin"], default: "user" },
  // Add any additional fields you need
  completedJobs: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  avatar: String,
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }]
});

export default mongoose.model("User", userSchema);
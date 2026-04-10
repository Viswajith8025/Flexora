import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  date: Date,
  compensation: Number,
  category: {
    type: String,
    enum: [
      "events",
      "delivery",
      "digital",
      "retail",
      "assistance",
      "general",
      "hospitality",
      "logistics",
      "security",
      "technical",
      "creative",
      "Delivery Driver",
      "Event Staff",
      "Promotional Staff",
      "Data Entry",
      "Cleaning / Maintenance",
      "Tutoring / Mentoring",
      "Freelance",
      "Catering",
      "Security",
      "Electrician Work",
      "Painting Work",
      "Wiring / Electrical Setup",
      "Construction / Demolition",
      "Building Helper"
    ],
    default: "general",
  },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  applicants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: { 
        type: String, 
        enum: ["applied", "accepted", "rejected"], 
        default: "applied" 
      },
      appliedAt: { type: Date, default: Date.now }
    }
  ],
  status: { type: String, enum: ["open", "closed"], default: "open" },
  createdAt: { type: Date, default: Date.now },
  reports: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      reason: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  jobType: { 
    type: String, 
    enum: ["on-site", "remote", "hybrid", "freelance"], 
    default: "on-site" 
  },
  paymentStatus: { 
    type: String, 
    enum: ["pending", "paid", "failed"], 
    default: "pending" 
  },
  razorpayOrderId: String,
  isFlagged: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  
  // High-fidelity details
  requirements: String,
  payType: { type: String, default: "hourly" },
  startDate: Date,
  endDate: Date,
  estimatedHours: Number,
  contactEmail: String,
  contactPhone: String
});

// Prevent OverwriteModelError in dev/hot-reload:
export default mongoose.models.Job || mongoose.model("Job", jobSchema);

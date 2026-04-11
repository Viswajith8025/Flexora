import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  razorpayOrderId: {
    type: String,
    required: true,
    unique: true
  },
  razorpayPaymentId: {
    type: String,
    sparse: true // Only populated after successful capture
  },
  razorpaySignature: {
    type: String,
    sparse: true
  },
  status: {
    type: String,
    enum: ['pending', 'captured', 'failed', 'refunded'],
    default: 'pending',
    index: true
  },
  paymentMethod: {
    type: String
  },
  errorDetails: {
    type: Object
  },
  metadata: {
    ip: String,
    userAgent: String,
    deviceId: String
  },
  verifiedAt: {
    type: Date
  }
}, { timestamps: true });

// Ensure we have indexes for rapid audit lookups
transactionSchema.index({ createdAt: -1 });

export default mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);

import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    enum: [
        'APPROVE_JOB', 
        'FLAG_JOB', 
        'DELETE_JOB', 
        'SUSPEND_USER', 
        'UNSUSPEND_USER', 
        'UPDATE_PAYMENT',
        'PROCESS_REFUND'
    ],
    index: true
  },
  resourceType: {
    type: String,
    enum: ['Job', 'User', 'Transaction'],
    required: true
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed // For storing specific changes/notes
  },
  metadata: {
    ip: String,
    userAgent: String
  }
}, { timestamps: true });

// Ensure we have indexes for rapid internal forensic searches
auditLogSchema.index({ createdAt: -1 });

export default mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);

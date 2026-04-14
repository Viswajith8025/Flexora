import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Identity is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Contact email is required"],
      lowercase: true,
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message content is required"],
    },
    status: {
      type: String,
      enum: ["pending", "resolved", "archived"],
      default: "pending",
    },
    resolvedAt: Date,
  },
  {
    timestamps: true,
    collection: "inquiries",
  }
);

export default mongoose.model("Inquiry", inquirySchema);

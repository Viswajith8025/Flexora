import express from "express";
import { submitInquiry, getInquiries, resolveInquiry } from "../controllers/contactController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * 📩 Public Inquiry Submission
 */
router.post("/submit", submitInquiry);

/**
 * 🛡️ Protected Admin Actions
 */
router.get("/all", authenticate, authorize("admin"), getInquiries);
router.patch("/resolve/:id", authenticate, authorize("admin"), resolveInquiry);

export default router;

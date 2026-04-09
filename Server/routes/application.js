import express from "express";
import { getMyApplications } from "../controllers/jobcontroller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/applications/my
router.get("/my", authenticate, getMyApplications);

export default router;

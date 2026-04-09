// Server/routes/notificationRoutes.js
import express from "express";
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notificationController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// All notification routes are protected
router.get("/", authenticate, getNotifications);
router.patch("/:id/read", authenticate, markAsRead);
router.post("/read-all", authenticate, markAllAsRead);

export default router;

import express from "express";
import { sendMessage, getMessages } from "../controllers/chatcontroller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, sendMessage);
router.get("/", authenticate, getMessages);

export default router;

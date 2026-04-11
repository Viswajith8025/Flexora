import express from "express";
import { createOrder, verifyPayment, verifyWebhook } from "../controllers/paymentController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/payment/create-order
router.post("/create-order", authenticate, createOrder);

// POST /api/payment/verify
router.post("/verify", authenticate, verifyPayment);

// Webhook /api/payment/webhook
router.post("/webhook", express.json({type: 'application/json'}), verifyWebhook);

export default router;

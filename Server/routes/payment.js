import express from "express";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/payment/create-order
router.post("/create-order", authenticate, createOrder);

// POST /api/payment/verify
router.post("/verify", authenticate, verifyPayment);

export default router;

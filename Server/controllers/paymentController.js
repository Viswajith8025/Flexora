import Razorpay from "razorpay";
import crypto from "crypto";
import Job from "../models/job.js";

// Initialize Razorpay
const getRazorpayInstance = () => {
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
};

export const createOrder = async (req, res) => {
    try {
        const { jobId } = req.body;
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ msg: "Job not found" });
        }

        // Only provider of the job can pay for it
        if (job.provider.toString() !== req.user.id) {
            return res.status(403).json({ msg: "Unauthorized" });
        }

        const razorpay = getRazorpayInstance();

        // Amount in paise (e.g., 50000 = ₹500)
        // For Flexora, let's set a standard fee of ₹499 for premium listing
        const amount = 499 * 100;
        const options = {
            amount: amount, 
            currency: "INR",
            receipt: `receipt_${jobId}`,
        };

        const order = await razorpay.orders.create(options);

        // Save Order ID to job
        job.razorpayOrderId = order.id;
        job.paymentStatus = "pending";
        await job.save();

        res.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            key_id: process.env.RAZORPAY_KEY_ID // Send to frontend for the modal
        });
    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(500).json({ msg: "Payment order creation failed", error: error.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isSignatureValid = expectedSignature === razorpay_signature;

        if (isSignatureValid) {
            // Find job by order ID
            const job = await Job.findOne({ razorpayOrderId: razorpay_order_id });
            if (!job) {
                return res.status(404).json({ msg: "Associated job not found" });
            }

            job.paymentStatus = "paid";
            // Optional: You could also add a field mark job as 'featured'
            await job.save();

            res.json({ msg: "Payment verified successfully", success: true });
        } else {
            res.status(400).json({ msg: "Invalid payment signature", success: false });
        }
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ msg: "Payment verification failed", error: error.message });
    }
};

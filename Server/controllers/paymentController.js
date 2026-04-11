import paymentService from "../services/paymentService.js";
import Transaction from "../models/Transaction.js";
import Job from "../models/job.js";

export const createOrder = async (req, res) => {
    try {
        const { jobId } = req.body;
        
        // Security check for input
        if (!jobId) {
            return res.status(400).json({ msg: "Please provide a Job ID" });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ msg: "Job not found" });
        }

        // Only provider of the job can pay for it
        if (job.provider.toString() !== req.user.id) {
            return res.status(403).json({ msg: "Unauthorized" });
        }

        // Check if environment keys are ready
        if (!process.env.RAZORPAY_KEY_ID) {
            return res.status(501).json({ msg: "Payment system not configured" });
        }

        // Standard Fee Calculation (Bank-grade: calculate on server, NEVER from frontend)
        const feeInInr = parseInt(process.env.RAZORPAY_PROMOTION_FEE) || 499;
        const amount = feeInInr * 100; // Convert to paise

        const order = await paymentService.createOrder({
            amount: amount, 
            currency: "INR",
            receipt: `rp_${jobId.toString().slice(-6)}_${Date.now()}`,
        });

        // 📊 Create Audit Trail (Bank-grade)
        await Transaction.create({
            userId: req.user.id,
            jobId: jobId,
            amount: amount,
            razorpayOrderId: order.id,
            status: "pending",
            metadata: {
                ip: req.ip,
                userAgent: req.headers["user-agent"]
            }
        });

        // Update Job with latest order Attempt
        job.razorpayOrderId = order.id;
        job.paymentStatus = "pending";
        await job.save();

        res.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            key_id: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        // High-fidelity logging for fintech debugging
        console.error("💥 PAYMENT ORDER CRASH:", {
            message: error.message,
            stack: error.stack,
            jobId: req.body?.jobId,
            userId: req.user?.id
        });
        
        res.status(500).json({ 
            msg: "Payment initialization failed", 
            error: error.message,
            debug: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Security Validation
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ msg: "Tampered request detected" });
        }

        // Verify Signature using secure service
        const isSignatureValid = paymentService.verifySignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (isSignatureValid) {
            // Find both Audit Log and the Resource
            const transaction = await Transaction.findOne({ razorpayOrderId: razorpay_order_id });
            const job = await Job.findOne({ razorpayOrderId: razorpay_order_id });

            if (!job || !transaction) {
                return res.status(404).json({ msg: "Matching records not found for payment" });
            }

            // Sync States (Bank-grade: Multi-model update)
            transaction.status = "captured";
            transaction.razorpayPaymentId = razorpay_payment_id;
            transaction.razorpaySignature = razorpay_signature;
            transaction.verifiedAt = new Date();
            await transaction.save();

            job.paymentStatus = "paid";
            await job.save();

            res.json({ msg: "Payment verified successfully", success: true });
        } else {
            // Log Fraud attempt
            await Transaction.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "failed", errorDetails: { message: "Invalid signature detected" } }
            );

            res.status(401).json({ msg: "Payment security verification failed", success: false });
        }
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ msg: "Critical error during verification", error: error.message });
    }
};

export const verifyWebhook = async (req, res) => {
    try {
        const signature = req.headers["x-razorpay-signature"];
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error("❌ WEBHOOK SECRET MISSING");
            return res.status(500).send("Webhook secret not configured");
        }

        const isValid = paymentService.verifyWebhookSignature(req.body, signature, webhookSecret);

        if (!isValid) {
            console.warn("⚠️ INVALID WEBHOOK SIGNATURE DETECTED");
            return res.status(400).send("Invalid signature");
        }

        const event = req.body.event;
        const payload = req.body.payload.payment.entity;

        console.log(`📡 WEBHOOK RECEIVED: ${event}`, payload.id);

        if (event === "payment.captured") {
            const orderId = payload.order_id;
            
            // 🛡️ Bank-grade Idempotency: Check if already processed
            const transaction = await Transaction.findOne({ razorpayOrderId: orderId });
            const job = await Job.findOne({ razorpayOrderId: orderId });

            if (!job || !transaction) {
                console.warn(`⚠️ WEBHOOK RECEIVED FOR UNKNOWN ORDER: ${orderId}`);
                return res.status(200).send("OK"); // Acknowledge to stop retries
            }

            // If already processed, ignore but acknowledge (Idempotency)
            if (transaction.status === "captured" || job.paymentStatus === "paid") {
                console.log(`ℹ️ WEBHOOK IGNORED: Order ${orderId} already processed.`);
                return res.status(200).send("OK");
            }

            // Sync States safely
            transaction.status = "captured";
            transaction.razorpayPaymentId = payload.id;
            transaction.verifiedAt = new Date();
            await transaction.save();

            job.paymentStatus = "paid";
            await job.save();
            console.log(`✅ WEBHOOK SYNC SUCCESS: Job ${job._id} marked as PAID`);
        }

        res.status(200).send("OK");
    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).send("Internal Server Error");
    }
};

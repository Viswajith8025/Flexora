import Razorpay from "razorpay";
import crypto from "crypto";

class PaymentService {
    constructor() {
        this.instance = null;
    }

    /**
     * Lazy initialization of Razorpay instance to prevent server crash if keys are missing
     */
    getInstance() {
        if (this.instance) return this.instance;

        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            console.error("❌ RAZORPAY ERROR: Keys are missing in .env");
            throw new Error("Razorpay keys are not configured. Please check your .env file.");
        }

        this.instance = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });

        return this.instance;
    }

    /**
     * Create a secure Razorpay order
     */
    async createOrder(options) {
        try {
            const rzp = this.getInstance();
            return await rzp.orders.create(options);
        } catch (error) {
            console.error("❌ RAZORPAY ORDER ERROR:", error);
            throw new Error(`Failed to create Razorpay order: ${error.description || error.message}`);
        }
    }

    /**
     * Verify payment signature from frontend
     */
    verifySignature(order_id, payment_id, signature) {
        try {
            const keySecret = process.env.RAZORPAY_KEY_SECRET;
            if (!keySecret) return false;

            const body = order_id + "|" + payment_id;
            const expectedSignature = crypto
                .createHmac("sha256", keySecret)
                .update(body.toString())
                .digest("hex");

            return expectedSignature === signature;
        } catch (error) {
            console.error("❌ SIGNATURE VERIFICATION ERROR:", error);
            return false;
        }
    }

    /**
     * Verify webhook signature from Razorpay (Fintech-hardened)
     */
    verifyWebhookSignature(payload, signature, webhookSecret) {
        try {
            const hmac = crypto.createHmac("sha256", webhookSecret);
            hmac.update(JSON.stringify(payload));
            const expectedSignature = hmac.digest("hex");
            
            // Bank-grade security: Use timingSafeEqual to prevent timing attacks
            // Both must be buffers for comparison
            const expectedBuffer = Buffer.from(expectedSignature);
            const signatureBuffer = Buffer.from(signature);

            if (expectedBuffer.length !== signatureBuffer.length) {
                return false;
            }

            return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
        } catch (error) {
            console.error("❌ WEBHOOK SIGNATURE ERROR:", error);
            return false;
        }
    }
}

export default new PaymentService();

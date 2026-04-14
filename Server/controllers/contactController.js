import Inquiry from "../models/Inquiry.js";

/**
 * 📩 Submit a New Inquiry
 * Captures user messages from the high-fidelity Contact page.
 */
export const submitInquiry = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ msg: "All fields are professionally required" });
        }

        const inquiry = new Inquiry({
            name,
            email,
            message
        });

        await inquiry.save();

        res.status(201).json({ 
            success: true, 
            msg: "Your inquiry has been professionally synchronization" 
        });
    } catch (error) {
        console.error("💥 INQUIRY SUBMISSION ERROR:", error);
        res.status(500).json({ msg: "Submission failed", error: error.message });
    }
};

/**
 * 🛡️ Get All Inquiries (Admin Only)
 * Orchestrates high-fidelity review of user support messages.
 */
export const getInquiries = async (req, res) => {
    try {
        // Only Admins allowed (checked via route middleware)
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (error) {
        console.error("💥 INQUIRY FETCH ERROR:", error);
        res.status(500).json({ msg: "Retrieval failed", error: error.message });
    }
};

/**
 * ✅ Resolve Inquiry
 * Marks a support message as professionally crystallizationed.
 */
export const resolveInquiry = async (req, res) => {
    try {
        const { id } = req.params;
        const inquiry = await Inquiry.findByIdAndUpdate(
            id, 
            { status: "resolved", resolvedAt: new Date() },
            { new: true }
        );
        
        if (!inquiry) return res.status(404).json({ msg: "Inquiry not found" });
        
        res.json({ msg: "Inquiry professionally crystallizationed", inquiry });
    } catch (error) {
        res.status(500).json({ msg: "Resolution failed", error: error.message });
    }
};

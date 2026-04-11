import Notification from "../models/notification.js";
import User from "../models/user.js";
import Job from "../models/job.js";
import { sendEmailAlert } from "../services/emailService.js";

export const getNotifications = async (req, res) => {
// ... existing code ...
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching notifications", error: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ msg: "Notification not found" });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ msg: "Error updating notification", error: err.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true }
    );
    res.json({ msg: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ msg: "Error updating notifications", error: err.message });
  }
};

// Internal utility function for other controllers
export const createNotification = async ({ recipient, sender, title, message, type, jobId }) => {
  try {
    const notification = new Notification({
      recipient,
      sender,
      title,
      message,
      type,
      jobId
    });
    await notification.save();

    // Professional Email Trigger (Background)
    (async () => {
      try {
        const [targetUser, sourceUser, job] = await Promise.all([
           User.findById(recipient).select("name email"),
           sender ? User.findById(sender).select("name") : null,
           jobId ? Job.findById(jobId).select("title applicants") : null
        ]);

        if (!targetUser?.email) return;

        if (type === 'application_submitted' || type === 'status_update') {
           const emailData = {
              jobTitle: job?.title || "Flexora Opportunity",
              seekerName: sourceUser?.name || "A candidate",
              status: type === 'status_update' ? (job?.applicants.find(a => a.user.toString() === recipient.toString())?.status || 'updated') : undefined
           };
           
           await sendEmailAlert(type, targetUser, emailData);
        }
      } catch (err) {
        console.error("📧 Background email alert failed:", err.message);
      }
    })();

    return notification;
  } catch (err) {
    console.error("Failed to create notification:", err);
  }
};

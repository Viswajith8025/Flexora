// Server/controllers/notificationController.js
import Notification from "../models/notification.js";

export const getNotifications = async (req, res) => {
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
    return notification;
  } catch (err) {
    console.error("Failed to create notification:", err);
  }
};

// backend/controllers/chatcontroller.js
import Message from "../models/message.js";

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text, jobId } = req.body;

    const message = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      text,
      job: jobId,
    });

    res.status(201).json({ msg: "Message sent", message });
  } catch (err) {
    res.status(500).json({ msg: "Sending message failed", error: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { jobId, withUserId } = req.query;

    const messages = await Message.find({
      job: jobId,
      $or: [
        { sender: req.user.id, receiver: withUserId },
        { sender: withUserId, receiver: req.user.id },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: "Fetching messages failed", error: err.message });
  }
};

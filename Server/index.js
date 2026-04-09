import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/job.js";
import http from "http";
import { Server } from "socket.io";
import chatRoutes from "./routes/chats.js";
import applicationRoutes from "./routes/application.js";
import paymentRoutes from "./routes/payment.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/admin.js";


import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL, 
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ 
    message: "Flexora API is Live and Operational ✅",
    endpoints: {
      auth: "/api/auth",
      jobs: "/api/jobs",
      chat: "/api/chat",
      test: "/api/test"
    }
  });
});

// Test routes
app.get("/api/test", (req, res) => res.send("Flexora API Operational ✅"));

// Socket.io Handling
io.on("connection", (socket) => {
  console.log("🔌 New socket connected: " + socket.id);

  // Handle message sending
  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    io.emit("receiveMessage", {
      senderId,
      receiverId,
      message,
      timestamp: new Date(),
    });
  });

  socket.on("disconnect", () => {
    console.log("🔌 Socket disconnected: " + socket.id);
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.error("Mongo Error:", err));

// DB events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});
mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("💥 GLOBAL ERROR:", err.stack);
  res.status(err.status || 500).json({
    msg: "Internal Server Error",
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start Server (use `server` instead of `app`)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));

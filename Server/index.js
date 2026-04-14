import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/job.js";
import http from "http";
import { Server } from "socket.io";
import chatRoutes from "./routes/chats.js";
import applicationRoutes from "./routes/application.js";
import paymentRoutes from "./routes/payment.js";
import contactRoutes from "./routes/contact.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/admin.js";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";


import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const allowedOrigins = [
  FRONTEND_URL,
  FRONTEND_URL.endsWith('/') ? FRONTEND_URL.slice(0, -1) : FRONTEND_URL + '/',
  "https://flexora-wheat.vercel.app"
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Security Middleware (Bank-grade but flexible for self-hosted media)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false, // Professional fix for cross-origin image blocks
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "blob:", "http://localhost:5000", "https://*.razorpay.com"],
      "connect-src": ["'self'", "http://localhost:5000", "https://*.razorpay.com"],
    },
  },
}));
app.use(mongoSanitize()); // Prevent NoSQL injection

// Middleware: CORS MUST be before Rate Limitinig to ensure OPTIONS preflights don't fail without headers
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased to 1000 to prevent strict SPA development blocks
  message: "Too many requests from this IP, please try again later."
});
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 payment attempts per hour
  message: "Multiple payment attempts detected. Please try again later for your security."
});

// Use global limiter
app.use("/api/", globalLimiter);
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res) => {
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
  }
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/payment", paymentLimiter, paymentRoutes); // Applying stricter limit on payments
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

// Bank-grade Error Resilience: Prevent process crashes from unhandled rejections (Modern Node.js)
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚫 UNHANDLED REJECTION AT:', promise, 'REASON:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('🚫 UNCAUGHT EXCEPTION:', error);
});

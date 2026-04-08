import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/job.js";
import http from "http";
import { Server } from "socket.io";
import chatRoutes from "./routes/chats.js";


import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // <-- Set to your frontend URL
    credentials: true,               // <-- Allow credentials for Socket.io
  },
});

// Middleware
app.use(cors({
  origin: "http://localhost:5173",   // <-- Set to your frontend URL
  credentials: true                  // <-- Allow credentials for API
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/chat", chatRoutes);


// Test routes
app.get("/api/test", (req, res) => res.send("Test route working ✅"));

// Serve Static Files in Production
const clientDistPath = path.join(__dirname, "../Client/dist");
console.log("📂 Serving static files from:", clientDistPath);
app.use(express.static(clientDistPath));

// Catch-all route for SPA
app.get("*", (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(clientDistPath, "index.html"));
  }
});

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

// Start Server (use `server` instead of `app`)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));

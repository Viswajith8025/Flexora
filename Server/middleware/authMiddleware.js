import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = (req, res, next) => {
  console.log("Auth middleware triggered");
  const token = req.headers["authorization"];
  console.log("Received token:", token);

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    console.log("Decoded user:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed (Unauthorized):", err.message);
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Admins only." });
  }
  next();
};

export const isProvider = (req, res, next) => {
  if (req.user.role !== "job_provider" && req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Provider role required." });
  }
  next();
};

export const isSeeker = (req, res, next) => {
  if (req.user.role !== "job_seeker" && req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Seeker role required." });
  }
  next();
};
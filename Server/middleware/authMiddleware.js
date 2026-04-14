import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * 🔐 Generic Authentication Middleware
 * Validates the JWT and attaches the user payload to the request.
 */
export const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Access denied. Authentication required." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};

/**
 * 🛡️ Centralized Role-Based Access Control (RBAC)
 * High-fidelity authorization guard that supports multiple roles.
 * Usage: authorize('admin', 'job_provider')
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized. Authentication context missing." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        msg: `Access denied. Requires one of the following roles: ${allowedRoles.join(", ")}` 
      });
    }

    next();
  };
};

/**
 * 🏺 Legacy Middleware Support (For backward compatibility)
 */
export const verifyAdmin = authorize("admin");
export const isProvider = authorize("admin", "job_provider");
export const isSeeker = authorize("admin", "job_seeker");
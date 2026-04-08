import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ debug: true }); // Enable debug logging

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file");
  process.exit(1);
}

export const registerUser = async (req, res) => {
  const { name, email, password, role = 'user' } = req.body;

  try {
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please provide all required fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      role: role === 'job_provider' ? 'provider' : 'user' 
    });

    return res.status(201)
      .header('Access-Control-Allow-Credentials', 'true')
      .json({ 
        msg: "Registered successfully",
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });

  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ 
      msg: "Registration error", 
      error: err.message 
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: "7d" }
    );

    return res
      .header('Access-Control-Allow-Credentials', 'true')
      .json({ 
        token,
        user: { 
          id: user._id,
          name: user.name, 
          email: user.email, 
          role: user.role === 'provider' ? 'job_provider' : 'job_seeker' 
        }
      });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ 
      msg: "Login error",
      error: err.message 
    });
  }
};
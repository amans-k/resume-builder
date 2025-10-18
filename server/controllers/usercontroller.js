import Resume from "../models/Resume.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

// ✅ Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// 🟢 REGISTER USER
// POST: /api/users/register
export const registeruser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create and save user (hashing handled by schema)
    const newUser = new User({ name, email, password });
    await newUser.save();

    const token = generateToken(newUser._id);
    newUser.password = undefined;

    return res.status(201).json({
      message: "User created successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// 🟢 LOGIN USER
// POST: /api/users/login
export const loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🟡 Login attempt:", email, password);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ No user found for:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("🟢 Found user:", user.email);

    // ✅ Compare password using schema method
    const isMatch = await user.comparePassword(password);
    console.log("🧩 Password match result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    user.password = undefined;

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// 🟢 GET USER BY ID (Protected)
export const getuserbyId = async (req, res) => {
  try {
    const userData = await User.findById(req.userId).select("-password");
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user: userData });
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// 🟢 GET USER RESUMES
export const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId });
    return res.status(200).json({ resumes });
  } catch (error) {
    console.error("Get resumes error:", error);
    return res.status(500).json({ message: error.message });
  }
};

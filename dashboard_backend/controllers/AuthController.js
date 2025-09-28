import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../models/UserModel.js";
import { generateTempPassword } from "../utils/generateTempPassword.js";
import { generateEmailFromName } from "../utils/generateEmailFromName.js";
// const JWT_SECRET = process.env.JWT_SECRET;
// const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const register = async (req, res) => {
  try {
    let { name, email, role, password } = req.body;

    // 🧩 If no email provided → generate one from name
    if (!email && name) {
      email = generateEmailFromName(name);
    }

    // 🚫 Check if user already exists
    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    let hashedPassword;
    let tempPassword = null;

    // 🔑 Handle password based on role
    if (role === "admin") {
      hashedPassword = await bcrypt.hash(password, 10);
    } else {
      tempPassword = generateTempPassword();
      hashedPassword = await bcrypt.hash(tempPassword, 10);
    }

    // 👤 Create the user
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    if (tempPassword) {
      console.log(`Temporary password for ${email}:`, tempPassword);
    }

    // ✅ Response
    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      tempPassword: tempPassword || undefined,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Email not found. Please check your email address.",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect password. Please try again.",
      });
    }

    // Short-lived access token for temp-password users
    let accessToken = jwt.sign(
      { id: user._id, mustChangePassword: user.mustChangePassword },
      process.env.JWT_SECRET,
      { expiresIn: "2d" } // only valid for update-password
    );
    console.log(accessToken);

    // Normal refresh token if password already changed
    let refreshToken = null;
    if (!user.mustChangePassword) {
      refreshToken = jwt.sign(
        { id: user._id, role: user.role, name: user.name },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        // sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });
    }
    console.log("e", refreshToken);

    res.json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        newUser: user.mustChangePassword,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      message: "An error occurred during login. Please try again later.",
    });
  }
};

export const refresh = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    // 1. Create a new access token
    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role }, // optional: include role in token
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // 2. Fetch user from DB
    // console.log(decoded);
    // 3. Return access token and minimal user info
    res.json({ accessToken, user: { name: decoded.name, role: decoded.role } });
  });
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};

export const updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user.id;

    if (!userId || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "User ID and new password are required",
      });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
        mustChangePassword: false,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully! Please login with your new password.",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating password",
    });
  }
};

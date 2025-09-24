import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../models/UserModel.js";
import { generateTempPassword } from "../utils/generateTempPassword.js";
// const JWT_SECRET = process.env.JWT_SECRET;
// const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const register = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    // Check if user already exists
    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    let hashedPassword;
    let tempPassword = null;

    if (role === "admin") {
      // For admins: use provided password
      hashedPassword = await bcrypt.hash(password, 10);
    } else {
      // For other roles: generate temporary password
      tempPassword = generateTempPassword();
      hashedPassword = await bcrypt.hash(tempPassword, 10);
    }

    // Create the user
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Log temp password if generated
    if (tempPassword) {
      console.log("Temporary password:", tempPassword);
    }

    res.status(201).json({
      message: "User registered",
      user: newUser,
      tempPassword: tempPassword || undefined, // only send if it exists
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  // console.log(JWT_SECRET);
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });
    console.log(user);
    // Short-lived access token for temp-password users
    let accessToken = jwt.sign(
      { id: user._id, mustChangePassword: user.mustChangePassword },
      process.env.JWT_SECRET,
      { expiresIn: "5m" } // only valid for update-password
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
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
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
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    console.log(decoded);
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
    console.log(req.id);
    const { newPassword } = req.body;
    const userId = req.user.id;
    // console("update");

    if (!userId || !newPassword) {
      return res
        .status(400)
        .json({ message: "User ID and new password are required" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
        mustChangePassword: false,
      },
      { new: true } // return updated doc
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Password updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

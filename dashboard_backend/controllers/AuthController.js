import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
import { generateTempPassword } from "../utils/generateTempPassword.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export const register = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const existing = await UserModel.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });
    const tempPassword = generateTempPassword();
    const hashed = await bcrypt.hash(tempPassword, 10);
    const newUser = await UserModel.create({
      name,
      email,
      password: hashed,
      role,
    });
    console.log(tempPassword);
    res
      .status(201)
      .json({ message: "User registered", user: newUser, tempPassword });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    // verify database data if matched
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "5s" }
    );
    // generate refresh token
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Store refresh token in cookie (HttpOnly)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // false on localhost
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // multiply by 1000 to convert seconds → milliseconds
      path: "/",
    });

    //     httpOnly: true → cannot be accessed via JS, but middleware can read it. ✅

    // secure: process.env.NODE_ENV === "production" → only sent over HTTPS in production.

    // If you’re testing on http://localhost:3000, this won’t be sent. ❌

    // sameSite: "strict" → the cookie is not sent on cross-site requests.

    // If you’re testing with a different port or domain, the cookie may not be included.

    // You are probably running backend on localhost:5000 and frontend on localhost:3000.

    // sameSite: strict + different ports = cookie not sent.

    // That’s why req.cookies.get("refreshToken") in middleware is undefined.

    // maxAge → fine.

    res.json({
      accessToken,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  // console.log(req.body);
};

export const refresh = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  jwt.verify(token, JWT_REFRESH_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    // 1. Create a new access token
    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role }, // optional: include role in token
      JWT_SECRET,
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

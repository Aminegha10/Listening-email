// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String, required: true }, // hashed
  mustChangePassword: { type: Boolean, default: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
}, { timestamps: true });

export default mongoose.model("User", userSchema);

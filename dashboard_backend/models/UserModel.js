import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // hashed password
  role: { type: String, enum: ["admin", "user"], default: "user" },
});
const UserModel = mongoose.model("User", userSchema);
export default UserModel;

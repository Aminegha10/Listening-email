import express from "express";
import logger from "../utils/Logger.js";
import {
  register,
  login,
  refresh,
  logout,
  updatePassword,
} from "../controllers/AuthController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
// Get top products
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.get("/test", verifyToken, (req, res) => {
  res.send("test");
});
router.put("/updatePassword", verifyToken, updatePassword);
router.post("/logout", logout);
export default router;

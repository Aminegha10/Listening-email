import express from "express";
import logger from "../utils/Logger.js";
import { GetAllUsers } from "../controllers/UsersController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
// Get top products
router.get("/allUsers", verifyToken, GetAllUsers);
export default router;

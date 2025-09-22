import express from "express";
import logger from "../utils/Logger.js";
import { GetAllUsers } from "../controllers/UsersController.js";

const router = express.Router();
// Get top products
router.get("/allUsers", GetAllUsers);
export default router;

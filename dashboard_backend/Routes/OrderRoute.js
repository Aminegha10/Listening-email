import express from "express";
import logger from "../utils/Logger.js";
import {
  AddOrder,
  GetOrderStats,
  GetRadarStats,
} from "../controllers/OrderController.js";

const router = express.Router();

// Add or update order
router.post("/Lead", AddOrder);

// Get order stats (total + today, optional filter by salesAgent)
router.get("/LeadStats", GetOrderStats);
// Get radar orders/leads stats (optional filter by agent)
router.get("/RadarStats", GetRadarStats);

export default router;

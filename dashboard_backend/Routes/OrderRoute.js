import express from "express";
import logger from "../utils/Logger.js";
import {
  AddOrder,
  GetOrderAndSalesStats,
  GetOrdersByAgents,
  GetOrdersTableStats,
  GetTopSalesAgent,
} from "../controllers/OrderController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Add or update order
router.post("/Lead", verifyToken, AddOrder);

// Get order stats (total + today, optional filter by salesAgent)
router.get("/LeadStats", verifyToken, GetOrderAndSalesStats);
router.get("/OrdersTableStats", verifyToken, GetOrdersTableStats);
router.get("/OrdersByAgents", verifyToken, GetOrdersByAgents);
router.get("/TopSalesAgent", verifyToken, GetTopSalesAgent);
export default router;

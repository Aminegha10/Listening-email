import express from "express";
import logger from "../utils/Logger.js";
import {
  AddOrder,
  GetOrderAndSalesStats,
  GetOrdersByAgents,
  GetOrdersTableStats,
  GetTopProducts,
} from "../controllers/OrderController.js";

const router = express.Router();

// Add or update order
router.post("/Lead", AddOrder);

// Get order stats (total + today, optional filter by salesAgent)
router.get("/LeadStats", GetOrderAndSalesStats);
router.get("/OrdersTableStats", GetOrdersTableStats);
router.get("/OrdersByAgents", GetOrdersByAgents);
router.get("/TopProducts", GetTopProducts);
export default router;

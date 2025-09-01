import express from "express";
import logger from "../utils/Logger.js";
import {
  AddOrder,
  GetOrderAndSalesStats,
  GetOrdersTableStats,
} from "../controllers/OrderController.js";

const router = express.Router();

// Add or update order
router.post("/Lead", AddOrder);

// Get order stats (total + today, optional filter by salesAgent)
router.get("/LeadStats", GetOrderAndSalesStats);
router.get("/OrdersTableStats", GetOrdersTableStats);

export default router;

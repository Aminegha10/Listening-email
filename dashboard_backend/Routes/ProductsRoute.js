import express from "express";
import logger from "../utils/Logger.js";
import { GetTopProducts ,GetProductsDetails} from "../controllers/ProductsController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
// Get top products
router.get("/TopProducts",verifyToken, GetTopProducts);
router.get("/ProductsDetails",verifyToken, GetProductsDetails);
export default router;

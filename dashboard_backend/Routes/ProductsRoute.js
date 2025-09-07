import express from "express";
import logger from "../utils/Logger.js";
import { GetTopProducts ,GetProductsDetails} from "../controllers/ProductsController.js";

const router = express.Router();
// Get top products
router.get("/TopProducts", GetTopProducts);
router.get("/ProductsDetails", GetProductsDetails);
export default router;

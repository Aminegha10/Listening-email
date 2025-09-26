import express from "express";
import { GetClients } from "../controllers/ClientsController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/getClients",verifyToken ,GetClients);
export default router;

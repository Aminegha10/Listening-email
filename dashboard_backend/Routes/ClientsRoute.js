import express from "express";
import { GetClients } from "../controllers/ClientsController.js";

const router = express.Router();

router.get("/getClients", GetClients);
export default router;

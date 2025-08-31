import express from "express";
import dotenv from "dotenv";
import logger from "./utils/Logger.js";
import connectDB from "./config/db.js";
import OrderRoute from "./Routes/OrderRoute.js";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
  })
);

// Connect to DB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Use routes
app.use("/api", OrderRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

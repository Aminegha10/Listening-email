import express from "express";
// import dotenv from "dotenv";
import logger from "./utils/Logger.js";
import connectDB from "./config/db.js";
import OrderRoute from "./Routes/OrderRoute.js";
import ProductsRoute from "./Routes/ProductsRoute.js";
import ClientsRoute from "./Routes/ClientsRoute.js";
import AuthRoute from "./Routes/AuthRoute.js";
import UsersRoute from "./Routes/Users.js";
import cookieParser from "cookie-parser";

import cors from "cors";

// dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // 👈 allows cookies to be sent
  })
);
app.use(cookieParser());
// Connect to DB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Use routes
app.use("/api", OrderRoute);
app.use("/api", ProductsRoute);
app.use("/api", ClientsRoute);
app.use("/api", UsersRoute);
app.use("/api/auth", AuthRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

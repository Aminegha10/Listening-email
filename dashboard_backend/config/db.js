// config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv"; // <-- import dotenv
import logger from "../utils/Logger.js";

// Load environment variables
dotenv.config(); // <-- call it at the top

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected");
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // exit process with failure
  }
};

export default connectDB;
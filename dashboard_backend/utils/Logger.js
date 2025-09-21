// utils/logger.js
import { createLogger, format, transports } from "winston";
import fs from "fs";
import path from "path";

// 🗓 Get today's date manually (YYYY-MM-DD)
const today = new Date().toISOString().split("T")[0];

// 🗂 Define log directories
const baseLogDir = path.join(process.cwd(), "logs");
const errorsDir = path.join(baseLogDir, "errors");
const infosDir = path.join(baseLogDir, "infos");

// 🏗️ Create directories if they don't exist
[baseLogDir, errorsDir, infosDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    // 🖥 Console log
    new transports.Console(),

    // 📂 Combined log (all levels)
    new transports.File({
      filename: path.join(baseLogDir, `app-${today}.log`),
    }),

    // 📂 Errors only
    new transports.File({
      level: "error",
      filename: path.join(errorsDir, `errors-${today}.log`),
    }),

    // 📂 Infos only
    new transports.File({
      level: "info",
      filename: path.join(infosDir, `infos-${today}.log`),
    }),
  ],
});

export default logger;

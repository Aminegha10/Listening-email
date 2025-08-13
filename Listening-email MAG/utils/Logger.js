// utils/logger.js
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

const logger = createLogger({
  level: "info",
  format: logFormat,
  transports: [
    // Console output
    new transports.Console(),

    // Combined (info + error) logs
    new DailyRotateFile({
      filename: "logs/app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "20d", // Keep logs for 20 days
      level: "info", // includes info + error
    }),

    // Info-only logs
    new DailyRotateFile({
      filename: "logs/infos/info-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "info",
      // Filter out errors
      format: format.combine(
        logFormat,
        format((info) => (info.level === "info" ? info : false))()
      ),
    }),

    // Error-only logs
    new DailyRotateFile({
      filename: "logs/errors/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "error",
    }),
  ],
});

export default logger;

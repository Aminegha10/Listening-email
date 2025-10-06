import express from "express";
import fs from "fs";
import { google } from "googleapis";
import authRoutes from "./Routes/AuthRoutes.js";
import startPolling from "./services/EmailPollingService.js";
import dotenv from "dotenv";
import pkg from "pdf-to-printer";
import logger from "./utils/Logger.js";
const { getPrinters } = pkg;

dotenv.config();

const app = express();
const port = 4000;
const tokensPath = "tokens.json";

// OAuth2 client setup
export const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "http://localhost:4000/oauth2callback"
);

// Load tokens if present
if (fs.existsSync(tokensPath)) {
  const tokens = JSON.parse(fs.readFileSync(tokensPath));
  oauth2Client.setCredentials(tokens);
}

// Scopes constant (optional export if needed)
export const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.modify",
];


// Use routes
app.use(authRoutes);

app.get("/", (req, res) => {
  logger.info("GET / called");
  res.send(`
    <h2>📩 Gmail Polling App</h2>
    <a href="/auth">Authenticate with Google</a><br>
    <a href="/latest-email">Get Latest Email</a>
  `);
});

// Start polling
startPolling(oauth2Client);

// Start server
app.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
});


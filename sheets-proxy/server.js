const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// Configuration from environment variables
const PORT = process.env.PORT || 5001;
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

// Validate required environment variables
if (!GOOGLE_SCRIPT_URL) {
  console.error("❌ ERROR: GOOGLE_SCRIPT_URL environment variable is required");
  console.log(
    "Please set GOOGLE_SCRIPT_URL to your Google Apps Script web app URL"
  );
  process.exit(1);
}

// CORS configuration
const corsOptions = {
  origin: CORS_ORIGIN,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    googleScriptUrl: GOOGLE_SCRIPT_URL ? "configured" : "missing",
  });
});

// Main proxy endpoint
app.post("/submit", async (req, res) => {
  try {
    console.log(`📤 Proxying request to Google Apps Script:`, req.body.action);

    const response = await axios.post(GOOGLE_SCRIPT_URL, req.body, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000, // 30 second timeout
    });

    console.log(`✅ Response received from Google Apps Script`);
    res.json(response.data);
  } catch (err) {
    console.error(`❌ Error proxying to Google Apps Script:`, err.message);
    res.status(500).json({
      success: false,
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log("\n" + "=".repeat(50));
  console.log("🚀 GOOGLE SHEETS PROXY SERVER");
  console.log("=".repeat(50));
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`🎯 Google Script URL: ${GOOGLE_SCRIPT_URL}`);
  console.log(`🌐 CORS Origin: ${CORS_ORIGIN}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log("=".repeat(50) + "\n");
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("👋 Received SIGINT, shutting down gracefully");
  process.exit(0);
});

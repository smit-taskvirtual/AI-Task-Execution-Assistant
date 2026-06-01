require("dotenv").config();

console.log(
  "API KEY FOUND:",
  !!process.env.OPENROUTER_API_KEY
);

console.log(
  "MODEL:",
  process.env.OPENROUTER_MODEL
);

const express = require("express");
const cors = require("cors");

const uploadRoutes = require("./routes/uploadRoutes");
const analysisRoutes = require("./routes/analysisRoutes");

const app = express();

// Middleware
app.use(cors());

app.use(
  express.json({
    limit: "20mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "20mb",
  })
);

// Health Check
app.get("/", (req, res) => {
  res.json({
    app: "AI Task Execution Assistant",
    status: "Running",
    version: "1.0.0",
  });
});

// Environment Test Route
app.get("/env-test", (req, res) => {
  res.json({
    apiKeyFound: !!process.env.OPENROUTER_API_KEY,
    model: process.env.OPENROUTER_MODEL,
  });
});

// API Routes
app.use("/api", uploadRoutes);
app.use("/api", analysisRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
=================================
🚀 Server running successfully
🌐 Port: ${PORT}
=================================
`);
});
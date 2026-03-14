const express = require("express");
const cors = require("cors");

const scrapeRoutes = require("./routes/scrape.routes");
const timelineRoutes = require("./routes/timeline.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main Routes
app.use("/api/scrape", scrapeRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Drug Insights API is running" });
});

module.exports = app;

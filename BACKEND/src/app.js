require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8']); // Fix for Atlas DNS resolution in some environments
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const scrapeRoutes = require("./routes/scrape.routes");
const timelineRoutes = require("./routes/timeline.routes");
const authRoutes = require("./routes/auth.routes");
const extractRoutes = require('./routes/extract.routes');
const verifyRoutes = require('./routes/verify.routes');
const bsMeterRoutes = require('./routes/bsMeter.routes');
const anonymizeRoutes = require('./routes/anonymize.routes');
const sentimentRoutes = require('./routes/sentiment.routes');
const hospitalsRoutes = require('./routes/hospitals.routes');
const voiceRoutes = require('./routes/voice.routes');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window (increased for demo)
  message: { error: "Too many requests from this IP, please try again after 15 minutes" }
});

const scrapeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 40, // Limit each IP to 40 scrape requests per hour (increased for demo)
  message: { error: "Scrape limit exceeded. Please wait an hour before requesting again." }
});

// Database Connection Constants
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// Main Routes
app.use("/api/scrape", scrapeLimiter, scrapeRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/auth", authLimiter, authRoutes);
app.use('/api/extract', extractRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/bs-meter', bsMeterRoutes);
app.use('/api/anonymize', anonymizeRoutes);
app.use('/api/sentiment', sentimentRoutes);
app.use('/api/hospitals', hospitalsRoutes);
app.use('/api/voice', voiceRoutes);


// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Drug Insights API is running" });
});

// Connect to MongoDB in background
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch(err => {
      console.error('Failed to connect to MongoDB', err.message);
    });
}

// Error Handler
app.use(errorHandler);

module.exports = app;

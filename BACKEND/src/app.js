require('dotenv').config();
const mongoose = require('mongoose');
const express = require("express");
const cors = require("cors");

const scrapeRoutes = require("./routes/scrape.routes");
const timelineRoutes = require("./routes/timeline.routes");
const authRoutes = require("./routes/auth.routes");
const extractRoutes = require('./routes/extract.routes');
const verifyRoutes = require('./routes/verify.routes');
const bsMeterRoutes = require('./routes/bsMeter.routes');
const anonymizeRoutes = require('./routes/anonymize.routes');
const sentimentRoutes = require('./routes/sentiment.routes');
const hospitalsRoutes = require('./routes/hospitals.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main Routes
app.use("/api/scrape", scrapeRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/extract', extractRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/bs-meter', bsMeterRoutes);
app.use('/api/anonymize', anonymizeRoutes);
app.use('/api/sentiment', sentimentRoutes);
app.use('/api/hospitals', hospitalsRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Drug Insights API is running" });
});

// Database Connection Constants
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// Start Server Immediately
app.listen(PORT, () => {
  console.log(`Backend AI processing logic is running on port ${PORT}`);
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

module.exports = app;

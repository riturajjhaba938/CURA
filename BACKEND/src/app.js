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

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Main Routes
app.use("/api/scrape", scrapeRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/extract', extractRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/bs-meter', bsMeterRoutes);
app.use('/api/anonymize', anonymizeRoutes);
app.use('/api/sentiment', sentimentRoutes);


// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Drug Insights API is running" });
});


mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Backend AI processing logic is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    // Continue running app anyway for demonstration or mock purposes
    app.listen(PORT, () => {
      console.log(`Backend AI processing logic is running on port ${PORT} (without MongoDB)`);
    });
  });
module.exports = app;

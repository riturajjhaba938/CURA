require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Routes
const extractRoutes = require('./routes/extract.routes');
const verifyRoutes = require('./routes/verify.routes');
const bsMeterRoutes = require('./routes/bsMeter.routes');
const anonymizeRoutes = require('./routes/anonymize.routes');
const sentimentRoutes = require('./routes/sentiment.routes');

const app = express();
app.use(express.json());

// Main Routes
app.use('/api/extract', extractRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/bs-meter', bsMeterRoutes);
app.use('/api/anonymize', anonymizeRoutes);
app.use('/api/sentiment', sentimentRoutes);

// Database Connection
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

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

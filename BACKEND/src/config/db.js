const mongoose = require("mongoose");
const dns = require("dns");
const logger = require("../utils/logger");

dns.setServers(['8.8.8.8']); // Fix for Atlas DNS resolution

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    const conn = await mongoose.connect(uri);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

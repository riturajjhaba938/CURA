/**
 * Simple logger utility with timestamps.
 */

const timestamp = () => new Date().toISOString();

const info = (message) => {
  console.log(`[${timestamp()}] [INFO]  ${message}`);
};

const warn = (message) => {
  console.warn(`[${timestamp()}] [WARN]  ${message}`);
};

const error = (message) => {
  console.error(`[${timestamp()}] [ERROR] ${message}`);
};

module.exports = { info, warn, error };

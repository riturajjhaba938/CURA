const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");

// Generate JWT Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

/**
 * Register a new user
 * POST /api/auth/register
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please add all fields" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      logger.info(`New user registered: ${email}`);
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    logger.error(`Register error: ${error.message}`);
    res.status(500).json({ error: "Server error during registration" });
  }
};

/**
 * Authenticate a user
 * POST /api/auth/login
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    // Match password
    if (user && (await user.matchPassword(password))) {
      logger.info(`User logged in: ${email}`);
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ error: "Server error during login" });
  }
};

/**
 * Get user profile data
 * GET /api/auth/profile
 * Access: Private
 */
const getUserProfile = async (req, res) => {
  res.status(200).json({
    _id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    createdAt: req.user.createdAt,
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};

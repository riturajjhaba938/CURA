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
    const { name, email, password, state, district, gender, mobileNumber, age } = req.body;

    // Check if user exists (email or mobile number)
    const userExists = await User.findOne({
      $or: [{ email }, { mobileNumber }],
    });

    if (userExists) {
      const message = userExists.email === email ? "Email already exists" : "Mobile number already exists";
      return res.status(400).json({ error: message });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      state,
      district,
      gender,
      mobileNumber,
      age,
    });

    if (user) {
      logger.info(`New user registered: ${email}`);
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        state: user.state,
        district: user.district,
        gender: user.gender,
        mobileNumber: user.mobileNumber,
        age: user.age,
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
    const { identifier, email, password } = req.body;
    const loginId = identifier || email;

    // Check for user email or mobile number
    const user = await User.findOne({
      $or: [{ email: loginId }, { mobileNumber: loginId }],
    });

    // Match password
    if (user && (await user.matchPassword(password))) {
      logger.info(`User logged in: ${loginId}`);
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        state: user.state,
        district: user.district,
        gender: user.gender,
        mobileNumber: user.mobileNumber,
        age: user.age,
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
    state: req.user.state,
    district: req.user.district,
    gender: req.user.gender,
    mobileNumber: req.user.mobileNumber,
    age: req.user.age,
    createdAt: req.user.createdAt,
  });
};

/**
 * Update user profile
 * PUT /api/auth/profile
 * Access: Private
 */
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { name, mobileNumber, gender, age, state, district } = req.body;

    if (name) user.name = name;
    if (mobileNumber) user.mobileNumber = mobileNumber;
    if (gender) user.gender = gender;
    if (age) user.age = age;
    if (state) user.state = state;
    if (district) user.district = district;

    const updatedUser = await user.save();
    logger.info(`Profile updated for: ${updatedUser.email}`);

    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      state: updatedUser.state,
      district: updatedUser.district,
      gender: updatedUser.gender,
      mobileNumber: updatedUser.mobileNumber,
      age: updatedUser.age,
      createdAt: updatedUser.createdAt,
    });
  } catch (error) {
    logger.error(`Profile update error: ${error.message}`);
    res.status(500).json({ error: "Server error during profile update" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};

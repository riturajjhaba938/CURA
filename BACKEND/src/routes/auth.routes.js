const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require("../controllers/auth.controller");
const { protect } = require("../middleware/authMiddleware");
const { check, validationResult } = require("express-validator");

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(err => err.msg) });
  }
  next();
};

// POST /api/auth/register
router.post(
  "/register",
  [
    check("name", "Name is required").notEmpty().trim(),
    check("email", "Please include a valid email").isEmail().normalizeEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    check("state", "State is required").optional().trim(),
    check("district", "District is required").optional().trim(),
    check("gender", "Gender must be M, F, or Other").optional().isIn(["M", "F", "Other"]),
    check("mobileNumber", "Please enter a valid 10-digit mobile number").optional().matches(/^\d{10}$/),
  ],
  validate,
  registerUser
);

// POST /api/auth/login
router.post(
  "/login",
  [
    check("identifier", "Email or mobile number is required").notEmpty(),
    check("password", "Password is required").notEmpty(),
  ],
  validate,
  loginUser
);

// GET /api/auth/profile (Protected route)
router.get("/profile", protect, getUserProfile);

// PUT /api/auth/profile (Protected route)
router.put("/profile", protect, updateUserProfile);

module.exports = router;

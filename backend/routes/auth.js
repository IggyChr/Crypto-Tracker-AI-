const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  registerUser,
  loginUser,
  getUser,
  updateCurrency,
} = require('../controllers/authController');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', registerUser);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginUser);

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, getUser);

// @desc    Update user currency preference
// @route   PUT /api/auth/currency
// @access  Private
router.put('/currency', protect, updateCurrency);

module.exports = router;
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getPortfolioSummary,
} = require('../controllers/transactionController');

// @desc    Get all transactions for user
// @route   GET /api/transactions
// @access  Private
router.get('/', protect, getTransactions);

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
router.post('/', protect, createTransaction);

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
router.delete('/:id', protect, deleteTransaction);

// @desc    Get portfolio summary
// @route   GET /api/transactions/portfolio
// @access  Private
router.get('/portfolio', protect, getPortfolioSummary);

module.exports = router;
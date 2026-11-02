const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');

// @desc    Get all transactions for user
// @route   GET /api/transactions
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).sort({
    date: -1,
  });
  res.json(transactions);
});

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = asyncHandler(async (req, res) => {
  const { coin, type, price, quantity, fees, date } = req.body;

  const transaction = await Transaction.create({
    user: req.user._id,
    coin,
    type,
    price,
    quantity,
    fees,
    date,
  });

  res.status(201).json(transaction);
});

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  // Make sure user owns the transaction
  if (transaction.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this transaction');
  }

  await transaction.deleteOne();
  res.json({ message: 'Transaction removed', id: req.params.id });
});

// @desc    Get portfolio summary
// @route   GET /api/transactions/portfolio
// @access  Private
const getPortfolioSummary = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id });

  // Group by coin
  const portfolio = {};

  transactions.forEach((tx) => {
    if (!portfolio[tx.coin]) {
      portfolio[tx.coin] = {
        coin: tx.coin,
        totalBought: 0,
        totalSold: 0,
        totalFees: 0,
        totalInvested: 0,
        transactions: [],
      };
    }

    if (tx.type === 'buy') {
      portfolio[tx.coin].totalBought += tx.quantity;
      portfolio[tx.coin].totalInvested += tx.price * tx.quantity + tx.fees;
    } else {
      portfolio[tx.coin].totalSold += tx.quantity;
    }

    portfolio[tx.coin].totalFees += tx.fees;
    portfolio[tx.coin].transactions.push(tx);
  });

  // Calculate net holdings
  Object.keys(portfolio).forEach((coin) => {
    portfolio[coin].netHoldings =
      portfolio[coin].totalBought - portfolio[coin].totalSold;
  });

  res.json(Object.values(portfolio));
});

module.exports = {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getPortfolioSummary,
};
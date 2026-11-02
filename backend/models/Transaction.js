const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  coin: {
    type: String,
    required: [true, 'Please add a coin symbol (e.g., BTC, ETH)'],
    uppercase: true,
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Please specify buy or sell'],
    enum: ['buy', 'sell'],
  },
  price: {
    type: Number,
    required: [true, 'Please add the price per coin'],
    min: 0,
  },
  quantity: {
    type: Number,
    required: [true, 'Please add the quantity'],
    min: 0,
  },
  fees: {
    type: Number,
    default: 0,
    min: 0,
  },
  date: {
    type: Date,
    required: [true, 'Please add the date and time of transaction'],
    default: Date.now,
  },
  totalValue: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculate total value before saving
transactionSchema.pre('save', function (next) {
  this.totalValue = this.price * this.quantity + this.fees;
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
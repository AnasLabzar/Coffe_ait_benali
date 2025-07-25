const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema({
  period: {
    type: String,
    enum: ['daily', 'monthly', 'annual'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalOrders: Number,
  totalOrderAmount: Number,
  totalSalaries: Number,
  totalExpenses: Number,
  netProfit: Number,
  details: {
    // Can store additional breakdown
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Finance', financeSchema);
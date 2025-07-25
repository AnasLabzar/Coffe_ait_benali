const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  periodStart: {
    type: Date,
    required: true
  },
  periodEnd: {
    type: Date,
    required: true
  },
  daysWorked: {
    type: Number,
    required: true
  },
  salaryRate: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  signatureEmployeur: String, // URL to signature image
  signatureDirecteur: String, // URL to signature image
  notes: String,
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
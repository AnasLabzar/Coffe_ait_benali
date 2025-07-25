const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  nomCafe: {
    type: String,
    required: true
  },
  adresse: {
    type: String,
    required: true
  },
  ville: {
    type: String,
    required: true
  },
  codeWifi: String,
  telephone: {
    type: String,
    required: true
  },
  email: String,
  logoUrl: String,
  ticketHeader: String,
  ticketFooter: String,
  ticketTaxRate: {
    type: Number,
    default: 0.1 // 10% VAT
  },
  currencySymbol: {
    type: String,
    default: 'DH'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

settingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Settings', settingsSchema);
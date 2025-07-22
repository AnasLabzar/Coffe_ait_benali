const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nomGlobal: { 
    type: String,
    required: function() { return this.type === 'global'; }
  },
  nomLocal: {
    type: String,
    required: function() { return this.type === 'local'; }
  },
  prixMatin: {
    type: Number,
    default: 0,
    required: function() { return this.type === 'local'; }
  },
  prixSoir: {
    type: Number,
    default: function() { return this.prixMatin; }
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  type: {
    type: String,
    enum: ['global', 'local'],
    required: true
  },
  // Image fields
  imageUrl: {
    type: String,
    default: ''
  },
  imagePublicId: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
productSchema.index({ nomGlobal: 1, type: 1 });
productSchema.index({ nomLocal: 1 });

module.exports = mongoose.model('Product', productSchema);
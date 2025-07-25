const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  total: {
    type: Number,
    required: true
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  tableNumber: {
    type: Number,
    required: true
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Espèce', 'Carte', 'Chèque'],
    default: 'Espèce'
  },
  isPaid: {
    type: Boolean,
    default: false
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

// Update timestamp on save
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);
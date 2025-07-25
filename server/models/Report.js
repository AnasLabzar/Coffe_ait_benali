const mongoose = require('mongoose');

const reportItemSchema = new mongoose.Schema({
  nomProduit: String,
  prix: Number,
  quantite: Number,
  total: Number,
  paymentMethod: String,
  employeeId: mongoose.Schema.Types.ObjectId,
  employeeName: String
}, { _id: false });

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['daily', 'monthly', 'annual'],
    required: true
  },
  dateDebut: {
    type: Date,
    required: true
  },
  dateFin: {
    type: Date,
    required: true
  },
  totalVentes: Number,
  totalBenefice: Number,
  parProduit: [reportItemSchema],
  parEmploye: [{
    employeeId: mongoose.Schema.Types.ObjectId,
    employeeName: String,
    totalVentes: Number
  }],
  parMoyenPaiement: [{
    method: String,
    total: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', reportSchema);
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  pin: { 
    type: String, 
    required: true, 
    unique: true,
    minlength: 4,
    maxlength: 6
  },
  fullName: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Admin', 'Gerant', 'Employee'], 
    default: 'Employee'
  },
  isActive: { type: Boolean, default: true },
  prixJour: { type: Number } // Daily wage for salary calculation
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
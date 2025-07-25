const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  prenom: {
    type: String,
    required: true,
    trim: true
  },
  telephone: {
    type: String,
    required: true,
    unique: true,  // This already creates an index
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  adresse: {
    type: String,
    trim: true
  },
  pointsFidelite: {
    type: Number,
    default: 0,
    min: 0
  },
  dateInscription: {
    type: Date,
    default: Date.now
  },
  derniereVisite: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for fast search
clientSchema.index({ telephone: 1 }, { unique: true });
clientSchema.index({ nom: 1, prenom: 1 });

module.exports = mongoose.model('Client', clientSchema);
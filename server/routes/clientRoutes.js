const express = require('express');
const router = express.Router();
const {
  createClient,
  searchClients,
  updateClient,
  getClientById,
  deleteClient,
  addLoyaltyPoints,
  redeemLoyaltyPoints
} = require('../controllers/clientController');
const { authenticate } = require('../middlewares/auth');

// Create client
router.post('/', authenticate(['Admin', 'Gerant', 'Employee']), createClient);

// Search clients
router.get('/search', authenticate(['Admin', 'Gerant', 'Employee']), searchClients);

// Get client by ID
router.get('/:id', authenticate(['Admin', 'Gerant', 'Employee']), getClientById);

// Update client
router.put('/:id', authenticate(['Admin', 'Gerant', 'Employee']), updateClient);

// Add loyalty points
router.post('/:id/add-points', authenticate(['Admin', 'Gerant', 'Employee']), addLoyaltyPoints);

// Redeem loyalty points
router.post('/:id/redeem-points', authenticate(['Admin', 'Gerant', 'Employee']), redeemLoyaltyPoints);

// Delete client
router.delete('/:id', authenticate(['Admin']), deleteClient);

module.exports = router;
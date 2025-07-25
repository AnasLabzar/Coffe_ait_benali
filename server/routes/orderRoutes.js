const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrdersByDate,
  getOrderById,
  deleteOrder
} = require('../controllers/orderController');
const { authenticate } = require('../middlewares/auth');

// Create order (accessible by any authenticated employee)
router.post('/', authenticate(['Admin', 'Gerant', 'Employee']), createOrder);

// Get all orders (admin/gerant only)
router.get('/', authenticate(['Admin', 'Gerant']), getOrders);

// Get orders by date range
router.get('/date', authenticate(['Admin', 'Gerant']), getOrdersByDate);

// Get single order
router.get('/:id', authenticate(['Admin', 'Gerant', 'Employee']), getOrderById);

// Delete order (admin only)
router.delete('/:id', authenticate(['Admin']), deleteOrder);

module.exports = router;
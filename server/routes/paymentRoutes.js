const express = require('express');
const router = express.Router();
const {
  createPayment,
  updatePaymentStatus,
  getPaymentsByEmployee,
  getPaymentsByDate
} = require('../controllers/paymentController');
const { authenticate } = require('../middlewares/auth');

router.post('/', authenticate(['Admin', 'Gerant']), createPayment);
router.put('/:id/status', authenticate(['Admin', 'Gerant']), updatePaymentStatus);
router.get('/employee/:id', authenticate(['Admin', 'Gerant']), getPaymentsByEmployee);
router.get('/', authenticate(['Admin', 'Gerant']), getPaymentsByDate);

module.exports = router;
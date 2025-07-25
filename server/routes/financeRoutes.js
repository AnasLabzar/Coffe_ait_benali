const express = require('express');
const router = express.Router();
const {
  generateFinancialReport,
  getFinancialReports,
  getNetBenefit
} = require('../controllers/financeController');
const { authenticate } = require('../middlewares/auth');

router.post('/generate', authenticate(['Admin', 'Gerant']), generateFinancialReport);
router.get('/', authenticate(['Admin', 'Gerant']), getFinancialReports);
router.get('/net-benefit', authenticate(['Admin', 'Gerant']), getNetBenefit);

module.exports = router;
const express = require('express');
const router = express.Router();
const { validateObjectId } = require('../middlewares/validateObjectId');
const {
  generateDailyReport,
  getReportById,
  getReportsByDate
} = require('../controllers/reportController');
const { authenticate } = require('../middlewares/auth');

router.post('/daily', authenticate(['Admin', 'Gerant']), generateDailyReport);
router.get('/', authenticate(['Admin', 'Gerant']), getReportsByDate);
router.get('/:id', 
  authenticate(['Admin', 'Gerant']), 
  validateObjectId, // Add validation middleware
  getReportById
);

module.exports = router;
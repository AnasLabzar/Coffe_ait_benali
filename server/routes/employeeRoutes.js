const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployees,
  createInitialAdmin
} = require('../controllers/employeeController');

// Special unprotected endpoint for initial setup
router.post('/initial-setup', createInitialAdmin);

// PIN-based authentication route
router.post('/login', require('../controllers/authController').pinLogin);

// Protected routes
router.get('/', authenticate(['Admin', 'Gerant']), getEmployees);
router.post('/', authenticate(['Admin', 'Gerant']), createEmployee);
router.put('/:id', authenticate(['Admin', 'Gerant']), updateEmployee);
router.delete('/:id', authenticate(['Admin']), deleteEmployee);

module.exports = router;
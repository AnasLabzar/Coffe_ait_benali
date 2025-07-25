const express = require('express');
const router = express.Router();
const { 
  getSettings, 
  updateSettings,
  uploadLogo: uploadLogoHandler  // Renamed to avoid conflict
} = require('../controllers/settingsController');
const { authenticate } = require('../middlewares/auth');
const { uploadLogo } = require('../middlewares/imageUpload');  // Fixed import

// Corrected route with proper middleware
router.post('/logo', 
  authenticate(['Admin', 'Gerant']), 
  uploadLogo,  // Use the middleware directly
  uploadLogoHandler  // Controller function
);

router.get('/', authenticate(['Admin', 'Gerant', 'Employee']), getSettings);
router.put('/', authenticate(['Admin', 'Gerant']), updateSettings);

module.exports = router;
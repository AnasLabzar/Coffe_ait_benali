const express = require('express');
const router = express.Router();
const {
  createGlobalProduct,
  createLocalProduct,
  updateProduct,
  getProducts,
  getProductById,
  updateStock,
  deleteProduct
} = require('../controllers/productController');
const { authenticate } = require('../middlewares/auth');
const { uploadProductImage } = require('../middlewares/imageUpload');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Use the middleware directly
router.post(
  '/global', 
  authenticate(['Admin', 'Gerant']), 
  uploadProductImage,
  createGlobalProduct
);

router.post(
  '/local',
  authenticate(['Admin', 'Gerant']),
  createLocalProduct
);

// Keep only this router setup:
router.put(
  '/:id', 
  authenticate(['Admin', 'Gerant']), 
  uploadProductImage, // This is the middleware from imageUpload.js
  updateProduct
);


// Protected routes without image upload
router.put('/stock/:id', authenticate(['Admin', 'Gerant']), updateStock);
router.delete('/:id', authenticate(['Admin']), deleteProduct);

module.exports = router;
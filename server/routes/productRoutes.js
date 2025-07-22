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

// Protected routes with image upload support
router.post(
  '/global', 
  authenticate(['Admin', 'Gerant']), 
  uploadProductImage,
  createGlobalProduct
);

router.post(
  '/local', 
  authenticate(['Admin', 'Gerant']), 
  uploadProductImage,
  createLocalProduct
);

router.put(
  '/:id', 
  authenticate(['Admin', 'Gerant']), 
  uploadProductImage,
  updateProduct
);

// Protected routes without image upload
router.put('/stock/:id', authenticate(['Admin', 'Gerant']), updateStock);
router.delete('/:id', authenticate(['Admin']), deleteProduct);

module.exports = router;
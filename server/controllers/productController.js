const Product = require('../models/Product');
const mongoose = require('mongoose');


// Helper: Handle image upload
const handleImageUpload = (req, existingProduct = null) => {
    let imageUrl = '';
    let imagePublicId = '';

    if (req.file) {
        imageUrl = req.file.path;
        imagePublicId = req.file.filename;

        // Delete old image if exists
        if (existingProduct && existingProduct.imagePublicId) {
            deleteImage(existingProduct.imagePublicId);
        }
    } else if (existingProduct) {
        // Keep existing image if not updated
        imageUrl = existingProduct.imageUrl;
        imagePublicId = existingProduct.imagePublicId;
    }

    return { imageUrl, imagePublicId };
};

// @desc    Create global product category
// @route   POST /api/products/global
// @access  Admin/Gerant
exports.createGlobalProduct = async (req, res) => {
    try {
        const { nomGlobal } = req.body;

        // Handle image upload
        const { imageUrl, imagePublicId } = handleImageUpload(req);

        // Check if global product exists
        const existingProduct = await Product.findOne({ nomGlobal, type: 'global' });
        if (existingProduct) {
            return res.status(400).json({ msg: 'Global product already exists' });
        }

        const product = new Product({
            nomGlobal,
            type: 'global',
            imageUrl,
            imagePublicId
        });

        await product.save();
        res.status(201).json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Create local product variant
// @route   POST /api/products/local
// @access  Admin/Gerant
exports.createLocalProduct = async (req, res) => {
    try {
        const {
            nomGlobal,
            nomLocal,
            prixMatin,
            prixSoir,
            stock
        } = req.body;

        // Handle image upload
        const { imageUrl, imagePublicId } = handleImageUpload(req);

        // Verify global product exists
        const globalProduct = await Product.findOne({
            nomGlobal,
            type: 'global'
        });
        if (!globalProduct) {
            return res.status(404).json({ msg: 'Global product not found' });
        }

        const product = new Product({
            nomGlobal,
            nomLocal,
            prixMatin: prixMatin || 0,
            prixSoir: prixSoir || prixMatin || 0,
            stock: stock || 0,
            type: 'local',
            imageUrl,
            imagePublicId
        });

        await product.save();
        res.status(201).json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin/Gerant
exports.updateProduct = async (req, res) => {
    try {
      const { 
        nomLocal,
        prixMatin,
        prixSoir,
        stock
      } = req.body;
  
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
      }
  
      // Handle image upload
      const { imageUrl, imagePublicId } = handleImageUpload(req, product);
      
      // Update fields
      if (nomLocal && product.type === 'local') product.nomLocal = nomLocal;
      if (prixMatin && product.type === 'local') product.prixMatin = prixMatin;
      if (prixSoir && product.type === 'local') product.prixSoir = prixSoir;
      if (stock !== undefined && product.type === 'local') product.stock = stock;
      
      product.imageUrl = imageUrl;
      product.imagePublicId = imagePublicId;
  
      await product.save();
      res.json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };

// @desc    Get all products
// @route   GET /api/products
// @access  Employee+
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ nomGlobal: 1, nomLocal: 1 });

        // Group by global products for frontend
        const groupedProducts = products.reduce((acc, product) => {
            if (product.type === 'global') {
                acc[product.nomGlobal] = {
                    ...product._doc,
                    variants: []
                };
            } else {
                if (acc[product.nomGlobal]) {
                    acc[product.nomGlobal].variants.push(product);
                }
            }
            return acc;
        }, {});

        res.json(Object.values(groupedProducts));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Employee+
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Update stock levels
// @route   PUT /api/products/stock/:id
// @access  Gerant+
exports.updateStock = async (req, res) => {
    try {
        const { adjustment } = req.body;

        const product = await Product.findById(req.params.id);
        if (!product || product.type !== 'local') {
            return res.status(404).json({ msg: 'Local product not found' });
        }

        product.stock += parseInt(adjustment);
        await product.save();

        res.json({
            msg: 'Stock updated',
            product: {
                id: product._id,
                nomLocal: product.nomLocal,
                newStock: product.stock
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin
exports.deleteProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
      }
  
      // Delete associated image
      if (product.imagePublicId) {
        await deleteImage(product.imagePublicId);
      }
  
      // Prevent deletion if product has variants
      if (product.type === 'global') {
        const hasVariants = await Product.exists({ 
          nomGlobal: product.nomGlobal,
          type: 'local'
        });
        if (hasVariants) {
          return res.status(400).json({ 
            msg: 'Cannot delete global product with existing variants' 
          });
        }
      }
  
      await product.remove();
      res.json({ msg: 'Product removed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
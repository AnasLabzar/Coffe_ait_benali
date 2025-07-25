const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create storage instances
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cafe_products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

const logoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cafe_logos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
    transformation: [{ width: 300, height: 300, crop: 'limit' }]
  }
});

// Create upload instances
exports.uploadProductImage = multer({ storage: productStorage }).single('image');
exports.uploadLogo = multer({ storage: logoStorage }).single('logo');

// Delete image from Cloudinary
exports.deleteImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Error deleting image:', err);
  }
};
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
for (const key of required) {
  if (!process.env[key]) {
    console.warn(`[warn] ${key} is not set`);
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    const folder = process.env.CLOUDINARY_FOLDER || 'valleyrose';
    // Let Cloudinary infer format and handle non-images like PDFs
    return { 
      folder, 
      resource_type: 'auto',
      access_mode: 'public', // Ensure files are publicly accessible
      type: 'upload' // Use 'upload' type for public assets
    };
  },
});

module.exports = { cloudinary, storage };




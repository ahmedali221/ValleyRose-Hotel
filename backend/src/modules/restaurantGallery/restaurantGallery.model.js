const mongoose = require('mongoose');

const RestaurantGallerySchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    caption: { type: String, trim: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RestaurantGallery', RestaurantGallerySchema);




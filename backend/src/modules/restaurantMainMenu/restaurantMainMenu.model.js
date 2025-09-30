const mongoose = require('mongoose');

const RestaurantMainMenuSchema = new mongoose.Schema(
  {
    pdfFile: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RestaurantMainMenu', RestaurantMainMenuSchema);




const mongoose = require('mongoose');

const RestaurantMainMenuSchema = new mongoose.Schema(
  {
    pdfFile: { type: String, required: true },
    pageCount: { type: Number, default: 5 }, // Number of pages in the PDF
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RestaurantMainMenu', RestaurantMainMenuSchema);




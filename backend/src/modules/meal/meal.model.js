const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    thumbnail: { type: String },
    type: { type: String, enum: ['Meal', 'Soup'], required: true },
    isRecommended: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Meal', MealSchema);





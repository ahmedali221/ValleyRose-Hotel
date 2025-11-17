const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true }, // Kept for backward compatibility, optional if name_de/name_en are provided
    name_de: { type: String, trim: true }, // German name
    name_en: { type: String, trim: true }, // English name
    description: { type: String, trim: true },
    thumbnail: { type: String },
    type: { type: String, enum: ['Meal', 'Soup'], required: true, index: true }, // Indexed for faster queries
    menuCategory: { type: String, enum: ['menu_1', 'menu_2'], default: null, index: true }, // Indexed for faster queries
    isRecommended: { type: Boolean, default: false, index: true }, // Indexed for faster queries
  },
  { timestamps: true }
);

// Compound index for common query patterns (type + menuCategory, type + isRecommended)
MealSchema.index({ type: 1, menuCategory: 1 });
MealSchema.index({ type: 1, isRecommended: 1 });

// Validation: require either title OR both name_de and name_en
MealSchema.pre('validate', function(next) {
  const hasTitle = this.title && this.title.trim().length > 0;
  const hasBothNames = this.name_de && this.name_de.trim().length > 0 && this.name_en && this.name_en.trim().length > 0;
  
  if (!hasTitle && !hasBothNames) {
    this.invalidate('title', 'Either title or both name_de and name_en must be provided');
  }
  next();
});

module.exports = mongoose.model('Meal', MealSchema);





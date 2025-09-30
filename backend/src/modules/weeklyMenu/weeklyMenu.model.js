const mongoose = require('mongoose');

const WeeklyMenuSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
      unique: true,
    },
    meals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }],
    soups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('WeeklyMenu', WeeklyMenuSchema);



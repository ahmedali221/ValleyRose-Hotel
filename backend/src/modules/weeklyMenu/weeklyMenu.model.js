const mongoose = require('mongoose');

const WeeklyMenuSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
      unique: true,
    },
    meals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }], // Kept for backward compatibility
    soups: { 
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }], 
      validate: {
        validator: function(v) {
          return v.length <= 1;
        },
        message: 'soups can have at most one soup'
      }
    }, // Soup - exactly one per day
    menu_1: { 
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }], 
      validate: {
        validator: function(v) {
          return v.length <= 1;
        },
        message: 'menu_1 can have at most one meal'
      }
    }, // Menu 1 meal - exactly one per day
    menu_2: { 
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }], 
      validate: {
        validator: function(v) {
          return v.length <= 1;
        },
        message: 'menu_2 can have at most one meal'
      }
    }, // Menu 2 meal - exactly one per day
  },
  { timestamps: true }
);

module.exports = mongoose.model('WeeklyMenu', WeeklyMenuSchema);



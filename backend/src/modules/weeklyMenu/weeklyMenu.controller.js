const { body, validationResult } = require('express-validator');
const WeeklyMenu = require('./weeklyMenu.model');

const upsertValidators = [
  body('day').isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  body('meals').optional().isArray(),
  body('soups').optional().isArray(),
];

async function getAll(_req, res) {
  try {
    const items = await WeeklyMenu.find().populate('meals').populate('soups').sort({ createdAt: 1 });
    res.json(items);
  } catch (err) {
    console.error('Error getting all weekly menus:', err);
    res.status(500).json({ message: 'Failed to fetch weekly menus', error: err.message });
  }
}

async function getByDay(req, res) {
  try {
    const item = await WeeklyMenu.findOne({ day: req.params.day }).populate('meals').populate('soups');
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    console.error('Error getting weekly menu by day:', err);
    res.status(500).json({ message: 'Failed to fetch weekly menu', error: err.message });
  }
}

async function upsert(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { day, meals = [], soups = [] } = req.body;
    const doc = await WeeklyMenu.findOneAndUpdate(
      { day },
      { day, meals, soups },
      { upsert: true, new: true }
    );
    const populated = await doc.populate('meals').populate('soups');
    res.json(populated);
  } catch (err) {
    console.error('Error upserting weekly menu:', err);
    res.status(500).json({ message: 'Failed to update weekly menu', error: err.message });
  }
}

async function addMealToDay(req, res) {
  try {
    const { day } = req.params;
    const { mealId, type = 'meals' } = req.body; // type can be 'meals' or 'soups'
    
    if (!mealId) {
      return res.status(400).json({ message: 'mealId is required' });
    }
    
    if (!['meals', 'soups'].includes(type)) {
      return res.status(400).json({ message: 'type must be either "meals" or "soups"' });
    }

    // Find or create the day's menu
    let doc = await WeeklyMenu.findOne({ day });
    if (!doc) {
      doc = new WeeklyMenu({ day, meals: [], soups: [] });
    }

    // Add the meal if it's not already there
    if (!doc[type].includes(mealId)) {
      doc[type].push(mealId);
      await doc.save();
    }

    // Populate using array syntax
    await doc.populate(['meals', 'soups']);
    res.json(doc);
  } catch (err) {
    console.error('Error adding meal to day:', err);
    res.status(500).json({ message: 'Failed to add meal to day', error: err.message });
  }
}

async function removeMealFromDay(req, res) {
  try {
    const { day } = req.params;
    const { mealId, type = 'meals' } = req.body; // type can be 'meals' or 'soups'
    
    if (!mealId) {
      return res.status(400).json({ message: 'mealId is required' });
    }
    
    if (!['meals', 'soups'].includes(type)) {
      return res.status(400).json({ message: 'type must be either "meals" or "soups"' });
    }

    const doc = await WeeklyMenu.findOne({ day });
    if (!doc) {
      return res.status(404).json({ message: 'Day not found' });
    }

    // Remove the meal
    doc[type] = doc[type].filter(id => id.toString() !== mealId);
    await doc.save();

    // Populate using array syntax
    await doc.populate(['meals', 'soups']);
    res.json(doc);
  } catch (err) {
    console.error('Error removing meal from day:', err);
    res.status(500).json({ message: 'Failed to remove meal from day', error: err.message });
  }
}

async function clearDay(req, res) {
  try {
    const doc = await WeeklyMenu.findOneAndUpdate({ day: req.params.day }, { meals: [], soups: [] }, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) {
    console.error('Error clearing weekly menu day:', err);
    res.status(500).json({ message: 'Failed to clear weekly menu', error: err.message });
  }
}

module.exports = { upsertValidators, getAll, getByDay, upsert, addMealToDay, removeMealFromDay, clearDay };




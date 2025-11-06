const { body, validationResult } = require('express-validator');
const WeeklyMenu = require('./weeklyMenu.model');

const upsertValidators = [
  body('day').isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  body('meals').optional().isArray(),
  body('soups').optional().isArray().custom((value) => {
    if (value && value.length > 1) {
      throw new Error('soups must contain at most one soup');
    }
    return true;
  }),
  body('menu_1').optional().isArray().custom((value) => {
    if (value && value.length > 1) {
      throw new Error('menu_1 must contain at most one meal');
    }
    return true;
  }),
  body('menu_2').optional().isArray().custom((value) => {
    if (value && value.length > 1) {
      throw new Error('menu_2 must contain at most one meal');
    }
    return true;
  }),
];

async function getAll(_req, res) {
  try {
    const items = await WeeklyMenu.find()
      .populate({
        path: 'meals',
        model: 'Meal',
        options: { strictPopulate: false }
      })
      .populate({
        path: 'soups',
        model: 'Meal',
        options: { strictPopulate: false }
      })
      .populate({
        path: 'menu_1',
        model: 'Meal',
        options: { strictPopulate: false }
      })
      .populate({
        path: 'menu_2',
        model: 'Meal',
        options: { strictPopulate: false }
      })
      .sort({ createdAt: 1 })
      .lean();
    
    // Filter out null/undefined populated items and clean up invalid references
    const cleanedItems = items.map(item => {
      const cleaned = { ...item };
      
      // Filter out null/undefined from each array
      if (cleaned.meals) {
        cleaned.meals = cleaned.meals.filter(meal => meal !== null && meal !== undefined);
      }
      if (cleaned.soups) {
        cleaned.soups = cleaned.soups.filter(soup => soup !== null && soup !== undefined);
      }
      if (cleaned.menu_1) {
        cleaned.menu_1 = cleaned.menu_1.filter(meal => meal !== null && meal !== undefined);
      }
      if (cleaned.menu_2) {
        cleaned.menu_2 = cleaned.menu_2.filter(meal => meal !== null && meal !== undefined);
      }
      
      return cleaned;
    });
    
    res.json(cleanedItems);
  } catch (err) {
    console.error('Error getting all weekly menus:', err);
    // Try to return empty array or partial data if possible
    try {
      const items = await WeeklyMenu.find().sort({ createdAt: 1 }).lean();
      res.json(items || []);
    } catch (fallbackErr) {
      console.error('Fallback query also failed:', fallbackErr);
      res.status(500).json({ message: 'Failed to fetch weekly menus', error: err.message });
    }
  }
}

async function getByDay(req, res) {
  try {
    const item = await WeeklyMenu.findOne({ day: req.params.day })
      .populate({
        path: 'meals',
        model: 'Meal',
        options: { strictPopulate: false }
      })
      .populate({
        path: 'soups',
        model: 'Meal',
        options: { strictPopulate: false }
      })
      .populate({
        path: 'menu_1',
        model: 'Meal',
        options: { strictPopulate: false }
      })
      .populate({
        path: 'menu_2',
        model: 'Meal',
        options: { strictPopulate: false }
      })
      .lean();
    
    if (!item) return res.status(404).json({ message: 'Not found' });
    
    // Filter out null/undefined populated items
    if (item.meals) {
      item.meals = item.meals.filter(meal => meal !== null && meal !== undefined);
    }
    if (item.soups) {
      item.soups = item.soups.filter(soup => soup !== null && soup !== undefined);
    }
    if (item.menu_1) {
      item.menu_1 = item.menu_1.filter(meal => meal !== null && meal !== undefined);
    }
    if (item.menu_2) {
      item.menu_2 = item.menu_2.filter(meal => meal !== null && meal !== undefined);
    }
    
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
    const { day, meals = [], soups = [], menu_1 = [], menu_2 = [] } = req.body;
    
    // Ensure soups, menu_1 and menu_2 have at most one item
    const soupsArray = Array.isArray(soups) ? soups.slice(0, 1) : [];
    const menu1Array = Array.isArray(menu_1) ? menu_1.slice(0, 1) : [];
    const menu2Array = Array.isArray(menu_2) ? menu_2.slice(0, 1) : [];
    
    const doc = await WeeklyMenu.findOneAndUpdate(
      { day },
      { day, meals, soups: soupsArray, menu_1: menu1Array, menu_2: menu2Array },
      { upsert: true, new: true }
    );
    
    // Populate with error handling
    try {
      await doc.populate([
        { path: 'meals', model: 'Meal', options: { strictPopulate: false } },
        { path: 'soups', model: 'Meal', options: { strictPopulate: false } },
        { path: 'menu_1', model: 'Meal', options: { strictPopulate: false } },
        { path: 'menu_2', model: 'Meal', options: { strictPopulate: false } }
      ]);
      
      // Filter out null/undefined populated items
      const docObj = doc.toObject();
      if (docObj.meals) docObj.meals = docObj.meals.filter(m => m !== null && m !== undefined);
      if (docObj.soups) docObj.soups = docObj.soups.filter(s => s !== null && s !== undefined);
      if (docObj.menu_1) docObj.menu_1 = docObj.menu_1.filter(m => m !== null && m !== undefined);
      if (docObj.menu_2) docObj.menu_2 = docObj.menu_2.filter(m => m !== null && m !== undefined);
      
      res.json(docObj);
    } catch (populateErr) {
      console.warn('Populate failed, returning document without populated fields:', populateErr);
      // Return the document even if populate fails
      res.json(doc);
    }
  } catch (err) {
    console.error('Error upserting weekly menu:', err);
    res.status(500).json({ message: 'Failed to update weekly menu', error: err.message });
  }
}

async function addMealToDay(req, res) {
  try {
    const { day } = req.params;
    const { mealId, type = 'meals' } = req.body; // type can be 'meals', 'soups', 'menu_1', or 'menu_2'
    
    if (!mealId) {
      return res.status(400).json({ message: 'mealId is required' });
    }
    
    if (!['meals', 'soups', 'menu_1', 'menu_2'].includes(type)) {
      return res.status(400).json({ message: 'type must be one of: "meals", "soups", "menu_1", or "menu_2"' });
    }

    // Find or create the day's menu
    let doc = await WeeklyMenu.findOne({ day });
    if (!doc) {
      doc = new WeeklyMenu({ day, meals: [], soups: [], menu_1: [], menu_2: [] });
    }

    // For soups, menu_1 and menu_2, replace the existing item (only one allowed)
    // For meals, add if not already there (multiple allowed)
    if (type === 'soups' || type === 'menu_1' || type === 'menu_2') {
      // Replace the existing item with the new one (or set it if empty)
      doc[type] = [mealId];
    } else {
      // Add the meal if it's not already there (for meals array)
      if (!doc[type].includes(mealId)) {
        doc[type].push(mealId);
      }
    }
    
    await doc.save();

    // Populate with error handling
    try {
      await doc.populate([
        { path: 'meals', model: 'Meal', options: { strictPopulate: false } },
        { path: 'soups', model: 'Meal', options: { strictPopulate: false } },
        { path: 'menu_1', model: 'Meal', options: { strictPopulate: false } },
        { path: 'menu_2', model: 'Meal', options: { strictPopulate: false } }
      ]);
      
      // Filter out null/undefined populated items
      const docObj = doc.toObject();
      if (docObj.meals) docObj.meals = docObj.meals.filter(m => m !== null && m !== undefined);
      if (docObj.soups) docObj.soups = docObj.soups.filter(s => s !== null && s !== undefined);
      if (docObj.menu_1) docObj.menu_1 = docObj.menu_1.filter(m => m !== null && m !== undefined);
      if (docObj.menu_2) docObj.menu_2 = docObj.menu_2.filter(m => m !== null && m !== undefined);
      
      res.json(docObj);
    } catch (populateErr) {
      console.warn('Populate failed, returning document without populated fields:', populateErr);
      // Return the document even if populate fails
      res.json(doc);
    }
  } catch (err) {
    console.error('Error adding meal to day:', err);
    res.status(500).json({ message: 'Failed to add meal to day', error: err.message });
  }
}

async function removeMealFromDay(req, res) {
  try {
    const { day } = req.params;
    const { mealId, type = 'meals' } = req.body; // type can be 'meals', 'soups', 'menu_1', or 'menu_2'
    
    if (!mealId) {
      return res.status(400).json({ message: 'mealId is required' });
    }
    
    if (!['meals', 'soups', 'menu_1', 'menu_2'].includes(type)) {
      return res.status(400).json({ message: 'type must be one of: "meals", "soups", "menu_1", or "menu_2"' });
    }

    const doc = await WeeklyMenu.findOne({ day });
    if (!doc) {
      return res.status(404).json({ message: 'Day not found' });
    }

    // Remove the meal
    doc[type] = doc[type].filter(id => id.toString() !== mealId);
    await doc.save();

    // Populate with error handling
    try {
      await doc.populate([
        { path: 'meals', model: 'Meal', options: { strictPopulate: false } },
        { path: 'soups', model: 'Meal', options: { strictPopulate: false } },
        { path: 'menu_1', model: 'Meal', options: { strictPopulate: false } },
        { path: 'menu_2', model: 'Meal', options: { strictPopulate: false } }
      ]);
      
      // Filter out null/undefined populated items
      const docObj = doc.toObject();
      if (docObj.meals) docObj.meals = docObj.meals.filter(m => m !== null && m !== undefined);
      if (docObj.soups) docObj.soups = docObj.soups.filter(s => s !== null && s !== undefined);
      if (docObj.menu_1) docObj.menu_1 = docObj.menu_1.filter(m => m !== null && m !== undefined);
      if (docObj.menu_2) docObj.menu_2 = docObj.menu_2.filter(m => m !== null && m !== undefined);
      
      res.json(docObj);
    } catch (populateErr) {
      console.warn('Populate failed, returning document without populated fields:', populateErr);
      // Return the document even if populate fails
      res.json(doc);
    }
  } catch (err) {
    console.error('Error removing meal from day:', err);
    res.status(500).json({ message: 'Failed to remove meal from day', error: err.message });
  }
}

async function clearDay(req, res) {
  try {
    const doc = await WeeklyMenu.findOneAndUpdate(
      { day: req.params.day },
      { meals: [], soups: [], menu_1: [], menu_2: [] },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) {
    console.error('Error clearing weekly menu day:', err);
    res.status(500).json({ message: 'Failed to clear weekly menu', error: err.message });
  }
}

module.exports = { upsertValidators, getAll, getByDay, upsert, addMealToDay, removeMealFromDay, clearDay };




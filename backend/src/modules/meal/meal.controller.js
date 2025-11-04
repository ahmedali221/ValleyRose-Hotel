const { body, validationResult } = require('express-validator');
const Meal = require('./meal.model');

const createValidators = [
  body('title').optional().trim(),
  body('name_de').optional().trim(),
  body('name_en').optional().trim(),
  body('description').optional().trim(),
  body('thumbnail').optional().isString(),
  body('type').isIn(['Meal', 'Soup']),
  body('menuCategory').optional().isIn(['menu_1', 'menu_2']),
  body('isRecommended').optional().isBoolean(),
  // Custom validation: require either title OR both name_de and name_en
  body().custom((value) => {
    const hasTitle = value.title && value.title.trim().length > 0;
    const hasBothNames = value.name_de && value.name_de.trim().length > 0 && value.name_en && value.name_en.trim().length > 0;
    
    if (!hasTitle && !hasBothNames) {
      throw new Error('Either title or both name_de and name_en must be provided');
    }
    return true;
  }),
];

async function createMeal(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const doc = await Meal.create(req.body);
  res.status(201).json(doc);
}

async function listMeals(req, res) {
  try {
    const { type, recommended, menuCategory } = req.query;
    const q = {};
    if (type) q.type = type;
    if (recommended !== undefined) q.isRecommended = recommended === 'true';
    if (menuCategory) q.menuCategory = menuCategory;
    const items = await Meal.find(q).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('Error listing meals:', err);
    res.status(500).json({ message: 'Failed to fetch meals', error: err.message });
  }
}

async function updateMeal(req, res) {
  const item = await Meal.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Meal not found' });
  res.json(item);
}

async function deleteMeal(req, res) {
  const item = await Meal.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Meal not found' });
  res.json({ success: true });
}

async function toggleRecommended(req, res) {
  const item = await Meal.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Meal not found' });
  item.isRecommended = !item.isRecommended;
  await item.save();
  res.json(item);
}

module.exports = { createValidators, createMeal, listMeals, updateMeal, deleteMeal, toggleRecommended };


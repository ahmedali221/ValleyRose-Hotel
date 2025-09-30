const { body, validationResult } = require('express-validator');
const Meal = require('./meal.model');

const createValidators = [
  body('title').notEmpty().trim(),
  body('description').optional().trim(),
  body('thumbnail').optional().isString(),
  body('type').isIn(['Meal', 'Soup']),
  body('isRecommended').optional().isBoolean(),
];

async function createMeal(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const doc = await Meal.create(req.body);
  res.status(201).json(doc);
}

async function listMeals(req, res) {
  const { type, recommended } = req.query;
  const q = {};
  if (type) q.type = type;
  if (recommended !== undefined) q.isRecommended = recommended === 'true';
  const items = await Meal.find(q).sort({ createdAt: -1 });
  res.json(items);
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


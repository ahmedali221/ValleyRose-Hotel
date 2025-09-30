const { body, validationResult } = require('express-validator');
const WeeklyMenu = require('./weeklyMenu.model');

const upsertValidators = [
  body('day').isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  body('meals').optional().isArray(),
  body('soups').optional().isArray(),
];

async function getAll(_req, res) {
  const items = await WeeklyMenu.find().populate('meals').populate('soups').sort({ createdAt: 1 });
  res.json(items);
}

async function getByDay(req, res) {
  const item = await WeeklyMenu.findOne({ day: req.params.day }).populate('meals').populate('soups');
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
}

async function upsert(req, res) {
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
}

async function clearDay(req, res) {
  const doc = await WeeklyMenu.findOneAndUpdate({ day: req.params.day }, { meals: [], soups: [] }, { new: true });
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json(doc);
}

module.exports = { upsertValidators, getAll, getByDay, upsert, clearDay };




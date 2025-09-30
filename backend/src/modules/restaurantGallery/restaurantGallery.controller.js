const { body, validationResult } = require('express-validator');
const RestaurantGallery = require('./restaurantGallery.model');

const createValidators = [
  body('caption').optional().trim(),
];

async function addImage(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const file = req.file;
  if (!file) return res.status(400).json({ message: 'image file required' });
  const doc = await RestaurantGallery.create({ image: file.path, caption: req.body.caption });
  res.status(201).json(doc);
}

async function listImages(_req, res) {
  const items = await RestaurantGallery.find().sort({ createdAt: -1 });
  res.json(items);
}

async function deleteImage(req, res) {
  const item = await RestaurantGallery.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true });
}

module.exports = { createValidators, addImage, listImages, deleteImage };




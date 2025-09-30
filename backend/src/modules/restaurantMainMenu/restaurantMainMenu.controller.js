const RestaurantMainMenu = require('./restaurantMainMenu.model');

async function uploadPdf(req, res) {
  const file = req.file;
  if (!file || file.mimetype !== 'application/pdf') return res.status(400).json({ message: 'PDF required' });
  const existing = await RestaurantMainMenu.findOne();
  if (existing) {
    existing.pdfFile = file.path;
    await existing.save();
    return res.json(existing);
  }
  const doc = await RestaurantMainMenu.create({ pdfFile: file.path });
  res.status(201).json(doc);
}

async function getPdf(_req, res) {
  const doc = await RestaurantMainMenu.findOne();
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json(doc);
}

async function deletePdf(_req, res) {
  const doc = await RestaurantMainMenu.findOneAndDelete({});
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true });
}

module.exports = { uploadPdf, getPdf, deletePdf };




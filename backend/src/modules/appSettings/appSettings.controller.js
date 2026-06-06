const { body, validationResult } = require('express-validator');
const AppSetting = require('./appSettings.model');

const updateValidators = [
  body('value').notEmpty().withMessage('value is required').isString(),
];

async function getSettings(req, res) {
  try {
    const settings = await AppSetting.find({});
    const data = settings.reduce((acc, doc) => {
      acc[doc.key] = doc.value;
      return acc;
    }, {});
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch settings', error: error.message });
  }
}

async function updateSetting(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { key } = req.params;
  try {
    const doc = await AppSetting.findOneAndUpdate(
      { key },
      { $set: { value: req.body.value } },
      { new: true }
    );
    if (!doc) return res.status(404).json({ success: false, message: `Setting '${key}' not found` });
    res.json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update setting', error: error.message });
  }
}

module.exports = { updateValidators, getSettings, updateSetting };

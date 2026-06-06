const mongoose = require('mongoose');

const AppSettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: String, required: true },
    label: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AppSetting', AppSettingSchema);

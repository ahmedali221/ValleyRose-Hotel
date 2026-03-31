const SiteSetting = require('./siteSettings.model');

async function getSettings(req, res) {
  try {
    const settings = await SiteSetting.find({});
    // Transform into a key-value object for easier consumption by frontend
    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.imageUrl;
      return acc;
    }, {});

    res.json({
      success: true,
      data: settings,
      map: settingsMap
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch site settings',
      error: error.message
    });
  }
}

async function updateSetting(req, res) {
  try {
    const { key } = req.params;
    const { label, description } = req.body;
    
    let updateData = {};
    if (label !== undefined) updateData.label = label;
    if (description !== undefined) updateData.description = description;
    // If a new image was uploaded via multer/cloudinary
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    const setting = await SiteSetting.findOneAndUpdate(
      { key },
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: `Setting ${key} updated successfully`,
      data: setting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update site setting',
      error: error.message
    });
  }
}

module.exports = {
  getSettings,
  updateSetting
};

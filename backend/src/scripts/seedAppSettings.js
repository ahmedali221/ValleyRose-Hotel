require('dotenv').config();
const { connect } = require('../setup/db');
const AppSetting = require('../modules/appSettings/appSettings.model');

const defaults = [
  { key: 'checkin_fee_type', value: 'fixed', label: 'Check-in Fee Type (fixed or percentage)' },
  { key: 'checkin_fee_amount', value: '50', label: 'Check-in Fee Value (EUR or %)' },
];

async function seed() {
  try {
    await connect();
    console.log('Connected to database');

    for (const setting of defaults) {
      const existing = await AppSetting.findOne({ key: setting.key });
      if (existing) {
        console.log(`Setting '${setting.key}' already exists — skipping.`);
      } else {
        await AppSetting.create(setting);
        console.log(`Created setting '${setting.key}' = '${setting.value}'`);
      }
    }

    console.log('App settings seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();

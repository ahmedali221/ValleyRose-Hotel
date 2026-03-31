require('dotenv').config();
const mongoose = require('mongoose');
const { connect } = require('../setup/db');
const SiteSetting = require('../modules/siteSettings/siteSettings.model');

const initialSettings = [
  {
    key: 'home_hero',
    label: 'Home Hero Image',
    imageUrl: 'https://res.cloudinary.com/dummy/image/upload/v1/home_hero.png', // Placeholder
    description: 'Main background image for the home page hero section'
  },
  {
    key: 'hotel_hero',
    label: 'Hotel Hero Image',
    imageUrl: 'https://res.cloudinary.com/dummy/image/upload/v1/hotel_hero.png',
    description: 'Hero image for the Hotel exploration page'
  },
  {
    key: 'restaurant_hero',
    label: 'Restaurant Hero Image',
    imageUrl: 'https://res.cloudinary.com/dummy/image/upload/v1/restaurant_hero.png',
    description: 'Hero image for the Restaurant page'
  },
  {
    key: 'contact_hero',
    label: 'Contact Us Hero Image',
    imageUrl: 'https://res.cloudinary.com/dummy/image/upload/v1/contact_hero.png',
    description: 'Hero image for the Contact Us page'
  },
  {
    key: 'about_image',
    label: 'About Section Image',
    imageUrl: 'https://res.cloudinary.com/dummy/image/upload/v1/about.png',
    description: 'Image shown in the About section on the home page'
  }
];

async function seed() {
  try {
    await connect();
    console.log('Connected to database');

    for (const setting of initialSettings) {
      await SiteSetting.findOneAndUpdate(
        { key: setting.key },
        { $setOnInsert: setting },
        { upsert: true, new: true }
      );
      console.log(`Ensured setting: ${setting.key}`);
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();

require('dotenv').config();
const mongoose = require('mongoose');
const { connect } = require('../setup/db');
const SiteSetting = require('../modules/siteSettings/siteSettings.model');

const initialSettings = [
  // Global / Header / Footer
  {
    key: 'logo',
    page: 'Global',
    label: 'Main Logo',
    imageUrl: 'https://res.cloudinary.com/dummy/image/upload/v1/logo.png',
    description: 'Header and Footer main logo'
  },
  
  // Home Page
  {
    key: 'home_hero',
    page: 'Home Page',
    label: 'Home Hero Image',
    imageUrl: 'https://res.cloudinary.com/dummy/image/upload/v1/home_hero.png',
    description: 'Main background image for the home page hero section'
  },
  {
    key: 'about_image',
    page: 'Home Page',
    label: 'About Section Image',
    imageUrl: 'https://res.cloudinary.com/dummy/image/upload/v1/about.png',
    description: 'Image shown in the About section on the home page'
  },
  {
    key: 'home_restaurant_food1',
    page: 'Home Page',
    label: 'Restaurant Food Image 1',
    imageUrl: 'https://res.cloudinary.com/dummy/image/upload/v1/food.png',
    description: 'First image in the home page restaurant section'
  },
  {
    key: 'home_restaurant_food2',
    page: 'Home Page',
    label: 'Restaurant Food Image 2',
    imageUrl: 'https://res.cloudinary.com/dummy/image/upload/v1/food1.png',
    description: 'Second image in the home page restaurant section'
  },

  // Hotel Page
  {
    key: 'hotel_hero',
    page: 'Hotel Page',
    label: 'Hotel Hero Image',
    imageUrl: 'https://res.cloudinary.com/dummy/image/upload/v1/hotel_hero.png',
    description: 'Hero image for the Hotel exploration page'
  },
  {
    key: 'hotel_event_space',
    page: 'Hotel Page',
    label: 'Event Space Image',
    imageUrl: 'https://res.cloudinary.com/dummy/image/upload/v1/event-space.svg',
    description: 'Image for the event space section in the Hotel page'
  },
  {
    key: 'hotel_image_1',
    page: 'Hotel Page',
    label: 'Hotel Gallery Image 1',
    imageUrl: 'https://res.cloudinary.com/dummy/image/upload/v1/hotel1.png',
    description: 'First gallery image in the Hotel page'
  },
  {
    key: 'hotel_image_2',
    page: 'Hotel Page',
    label: 'Hotel Gallery Image 2',
    imageUrl: 'https://res.cloudinary.com/dummy/image/upload/v1/hotel2.png',
    description: 'Second gallery image in the Hotel page'
  },

  // Restaurant Page
  {
    key: 'restaurant_hero',
    page: 'Restaurant Page',
    label: 'Restaurant Hero Image',
    imageUrl: 'https://res.cloudinary.com/dummy/image/upload/v1/restaurant_hero.png',
    description: 'Hero image for the Restaurant page'
  },
  {
    key: 'restaurant_weekly_menu',
    page: 'Restaurant Page',
    label: 'Weekly Menu Image',
    imageUrl: 'https://res.cloudinary.com/dummy/image/upload/v1/restaurant.png',
    description: 'Image in the Weekly Menu section'
  },
  {
    key: 'restaurant_event_space',
    page: 'Restaurant Page',
    label: 'Event Space Image',
    imageUrl: 'https://res.cloudinary.com/dummy/image/upload/v1/event-space.svg',
    description: 'Image for the event space section in the Restaurant page'
  },
  {
    key: 'restaurant_hotel_1',
    page: 'Restaurant Page',
    label: 'Restaurant Gallery Image 1',
    imageUrl: 'https://res.cloudinary.com/dummy/image/upload/v1/hotel1.png',
    description: 'First gallery image in the Restaurant page'
  },
  {
    key: 'restaurant_hotel_2',
    page: 'Restaurant Page',
    label: 'Restaurant Gallery Image 2',
    imageUrl: 'https://res.cloudinary.com/dummy/image/upload/v1/hotel2.png',
    description: 'Second gallery image in the Restaurant page'
  },

  // Contact Us Page
  {
    key: 'contact_hero',
    page: 'Contact Us Page',
    label: 'Contact Us Hero Image',
    imageUrl: 'https://res.cloudinary.com/dummy/image/upload/v1/contact_hero.png',
    description: 'Hero image for the Contact Us page'
  },

  // Check Reservation Page
  {
    key: 'check_reservation_hero',
    page: 'Check Reservation Page',
    label: 'Check Reservation Hero Image',
    imageUrl: 'https://res.cloudinary.com/dummy/image/upload/v1/image.png',
    description: 'Hero image for the check reservation page'
  },
  {
    key: 'check_reservation_character',
    page: 'Check Reservation Page',
    label: 'Character Image',
    imageUrl: 'https://res.cloudinary.com/dummy/image/upload/v1/chracter.png',
    description: 'Character image shown on the check reservation page'
  },
  {
    key: 'check_reservation_logo_vector',
    page: 'Check Reservation Page',
    label: 'Vector Logo',
    imageUrl: 'https://res.cloudinary.com/dummy/image/upload/v1/Vector.png',
    description: 'Secondary vector logo used on the check reservation page'
  },

  // Booking Page
  {
    key: 'booking_hero',
    page: 'Booking Page',
    label: 'Booking Hero Image',
    imageUrl: 'https://res.cloudinary.com/dummy/image/upload/v1/image.png',
    description: 'Hero image for the booking page'
  }
];


async function seed() {
  try {
    await connect();
    console.log('Connected to database');

    for (const setting of initialSettings) {
      await SiteSetting.findOneAndUpdate(
        { key: setting.key },
        { 
          $set: { 
            page: setting.page, 
            label: setting.label, 
            description: setting.description 
          },
          $setOnInsert: { imageUrl: setting.imageUrl }
        },
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

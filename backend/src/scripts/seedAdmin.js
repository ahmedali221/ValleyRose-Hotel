require('dotenv').config();
const mongoose = require('mongoose');
const { connect } = require('../setup/db');
const User = require('../modules/auth/user.model');

const adminData = {
  name: 'Demo Admin',
  email: 'admin@valleyrose.com',
  password: 'adminpassword123', // This will be hashed by the User model's pre-save hook
  role: 'admin',
  isMainAdmin: true
};

async function seed() {
  try {
    await connect();
    console.log('Connected to database');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('Admin already exists. Updating existing admin...');
      existingAdmin.name = adminData.name;
      existingAdmin.password = adminData.password;
      existingAdmin.role = adminData.role;
      existingAdmin.isMainAdmin = adminData.isMainAdmin;
      await existingAdmin.save();
    } else {
      console.log('Creating new demo admin...');
      await User.create(adminData);
    }

    console.log('Admin seeding completed successfully');
    console.log('-----------------------------------');
    console.log(`Email: ${adminData.email}`);
    console.log(`Password: ${adminData.password}`);
    console.log('-----------------------------------');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();

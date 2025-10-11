const mongoose = require('mongoose');

async function connect() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not set');
  }
  
  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB already connected');
    return;
  }
  
  mongoose.set('strictQuery', true);
  
  try {
    await mongoose.connect(mongoUri, { 
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
      bufferCommands: false // Disable mongoose buffering
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

module.exports = { connect };




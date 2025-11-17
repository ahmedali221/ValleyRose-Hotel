const mongoose = require('mongoose');

let cachedConnection = null;

async function connect() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not set');
  }
  
  // Check if already connected or connecting
  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB already connected');
    return cachedConnection;
  }
  
  // If connection is in progress, wait for it
  if (mongoose.connection.readyState === 2) {
    console.log('MongoDB connection in progress, waiting...');
    await new Promise(resolve => {
      mongoose.connection.once('connected', resolve);
      mongoose.connection.once('error', resolve);
    });
    if (mongoose.connection.readyState === 1) {
      return cachedConnection;
    }
  }
  
  mongoose.set('strictQuery', true);
  
  try {
    console.log('Establishing new MongoDB connection...');
    cachedConnection = await mongoose.connect(mongoUri, { 
      serverSelectionTimeoutMS: 30000, // 30 second timeout for serverless cold starts
      socketTimeoutMS: 75000, // 75 second socket timeout
      connectTimeoutMS: 30000, // 30 second connection timeout
      maxPoolSize: 10, // Connection pool size
      minPoolSize: 2, // Minimum connection pool size
      bufferCommands: false, // Disable mongoose buffering
      retryWrites: true, // Retry write operations
      retryReads: true, // Retry read operations
    });
    
    console.log('MongoDB connected successfully');
    
    // Ensure indexes are created (async, don't block)
    setTimeout(async () => {
      try {
        const Meal = require('../modules/meal/meal.model');
        const WeeklyMenu = require('../modules/weeklyMenu/weeklyMenu.model');
        await Promise.all([
          Meal.createIndexes(),
          WeeklyMenu.createIndexes()
        ]);
        console.log('✅ Database indexes ensured');
      } catch (err) {
        console.warn('⚠️ Error creating indexes:', err.message);
      }
    }, 1000);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
      cachedConnection = null;
    });
    
    return cachedConnection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    cachedConnection = null;
    throw error;
  }
}

module.exports = { connect };




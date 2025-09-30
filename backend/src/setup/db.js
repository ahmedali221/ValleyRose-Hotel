const mongoose = require('mongoose');

async function connect() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not set');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, { dbName: undefined });
  console.log('MongoDB connected');
}

module.exports = { connect };




require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connect } = require('./setup/db');

const authRoutes = require('./modules/auth/auth.routes');
const roomRoutes = require('./modules/room/room.routes');
const customerRoutes = require('./modules/customer/customer.routes');
const offlineReservationRoutes = require('./modules/offlineReservation/offlineReservation.routes');
const paymentRoutes = require('./modules/payment/payment.routes');
const analyticsRoutes = require('./modules/analytics/analytics.routes');
const mealRoutes = require('./modules/meal/meal.routes');
const weeklyMenuRoutes = require('./modules/weeklyMenu/weeklyMenu.routes');
const restaurantGalleryRoutes = require('./modules/restaurantGallery/restaurantGallery.routes');
const restaurantMainMenuRoutes = require('./modules/restaurantMainMenu/restaurantMainMenu.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database connection for serverless
let isConnected = false;

const ensureConnection = async () => {
  if (!isConnected) {
    try {
      await connect();
      isConnected = true;
      console.log('Database connected in serverless function');
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }
};

app.get('/health', (_req, res) => res.json({ ok: true }));

// Test endpoint without database dependency
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is working',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Middleware to ensure database connection for API routes
app.use('/api', async (req, res, next) => {
  try {
    await ensureConnection();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/offline-reservations', offlineReservationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/weekly-menu', weeklyMenuRoutes);
app.use('/api/restaurant-gallery', restaurantGalleryRoutes);
app.use('/api/restaurant-main-menu', restaurantMainMenuRoutes);

// For Vercel deployment
module.exports = app;

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  connect().then(() => {
    app.listen(PORT, () => console.log(`API listening on :${PORT}`));
  });
}

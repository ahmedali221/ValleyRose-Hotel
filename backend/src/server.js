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

app.get('/health', (_req, res) => res.json({ ok: true }));

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


const PORT = process.env.PORT || 4000;
connect().then(() => {
  app.listen(PORT, () => console.log(`API listening on :${PORT}`));
});




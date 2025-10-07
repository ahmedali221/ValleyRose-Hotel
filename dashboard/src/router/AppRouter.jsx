import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import LoginPage from '../components/Auth/LoginPage';
import Layout from '../components/Layout/Layout';
import HomePage from '../pages/Home/HomePage';
import HotelPage from '../pages/Hotel/HotelPage';
import RoomPreview from '../pages/Hotel/components/RoomPreview';
import RestaurantPage from '../pages/Restaurant/RestaurantPage';
import OfflineReservationPage from '../pages/OfflineReservation/OfflineReservationPage';
import ManageBookingsPage from '../pages/ManageBookings/ManageBookingsPage';
import SettingsPage from '../pages/Settings/SettingsPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'hotel',
        element: <HotelPage />,
      },
      {
        path: 'hotel/rooms/:id',
        element: <RoomPreview />,
      },
      {
        path: 'restaurant',
        element: <RestaurantPage />,
      },
      {
        path: 'offline-reservation',
        element: <OfflineReservationPage />,
      },
      {
        path: 'manage-bookings',
        element: <ManageBookingsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]);

const AppRouter = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default AppRouter;

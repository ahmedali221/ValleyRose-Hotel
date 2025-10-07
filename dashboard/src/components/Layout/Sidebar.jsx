import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Hotel', href: '/hotel' },
    { name: 'Restaurant', href: '/restaurant' },
    { name: 'Offline Reservation', href: '/offline-reservation' },
    { name: 'Manage Bookings', href: '/manage-bookings' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-80 bg-gray-100 h-screen flex flex-col">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-purple-600 font-serif">Valley Rose</h1>
        <p className="text-sm font-semibold text-black">Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-black hover:bg-gray-200'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
        {/* Separator and Settings/Logout directly under navbar, no spaces */}
        <div className="border-t border-gray-300 mx-0 mt-5"></div>
        <div className="space-y-1 px-0 py-5">
          <Link
            to="/settings"
            className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${
              isActive('/settings')
                ? 'bg-purple-100 text-purple-700'
                : 'text-black hover:bg-gray-200'
            }`}
          >
            Settings
          </Link>
          <button 
            onClick={logout}
            className="block w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200 text-left"
          >
            LogOut
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;

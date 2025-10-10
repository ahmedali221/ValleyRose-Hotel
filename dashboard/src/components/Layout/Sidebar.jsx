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
    <div className="w-80 content-section-heavy h-screen flex flex-col">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold valley-rose-text title-font">Valley Rose</h1>
        <p className="text-sm font-semibold text-gray-700">Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${
                    active
                      ? 'text-black'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                  style={
                    active
                      ? {
                          backgroundColor: 'rgba(153, 98, 185, 0.15)' // 15% opacity of var(--primary-color)
                        }
                      : {}
                  }
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
                ? 'text-black'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
            style={isActive('/settings') ? {backgroundColor: 'var(--primary-color)'} : {}}
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

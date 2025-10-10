import React, { useState } from 'react';
import AllBookings from './components/AllBookings';
import Rooms from './components/Rooms';
import AddNew from './components/AddNew';

const HotelPage = () => {
  const [activeTab, setActiveTab] = useState('all-bookings');

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="content-section-heavy border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold valley-rose-text title-font mb-4">Hotel</h1>
        
        {/* Main Tabs */}
        <div className="flex flex-col items-center space-y-4">
          {/* Centered tabs */}
          <div className="flex space-x-1 justify-center space-x-15">
            <button
              onClick={() => setActiveTab('all-bookings')}
              className={`px-4 py-2 text-sm font-medium transition-colors focus:outline-none ${
                activeTab === 'all-bookings'
                  ? 'valley-rose-text'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              All Bookings
            </button>
            <button
              onClick={() => setActiveTab('rooms')}
              className={`px-4 py-2 text-sm font-medium transition-colors focus:outline-none ${
                activeTab === 'rooms'
                  ? 'valley-rose-text'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Rooms
            </button>
            <button
              onClick={() => setActiveTab('add-new')}
              className={`px-4 py-2 text-sm font-medium transition-colors focus:outline-none ${
                activeTab === 'add-new'
                  ? 'valley-rose-text'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Add New
            </button>
          </div>
          
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'all-bookings' && <AllBookings />}
        {activeTab === 'rooms' && <Rooms />}
        {activeTab === 'add-new' && <AddNew />}
      </div>

      {/* Footer */}
      <div className="content-section-heavy border-t border-gray-200 px-6 py-4">
        <p className="text-center text-sm text-gray-500">
          © 2022-2025 by ValleyRose.com, Inc.
        </p>
      </div>
    </div>
  );
};

export default HotelPage;

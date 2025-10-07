import React, { useState } from 'react';
import AllBookings from './components/AllBookings';
import Rooms from './components/Rooms';
import AddNew from './components/AddNew';

const HotelPage = () => {
  const [activeTab, setActiveTab] = useState('all-bookings');

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Hotel</h1>
        
        {/* Main Tabs */}
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('all-bookings')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'all-bookings'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            All Bookings
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'rooms'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Rooms
          </button>
          <button
            onClick={() => setActiveTab('add-new')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'add-new'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Add New
          </button>
          {activeTab === 'add-new' && (
            <button className="ml-auto px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium flex items-center">
              <span className="mr-2">👁</span>
              Preview
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'all-bookings' && <AllBookings />}
        {activeTab === 'rooms' && <Rooms />}
        {activeTab === 'add-new' && <AddNew />}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <p className="text-center text-sm text-gray-500">
          © 2022-2025 by ValleyRose.com, Inc.
        </p>
      </div>
    </div>
  );
};

export default HotelPage;

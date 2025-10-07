import React, { useState } from 'react';
import Main from './components/Main';
import WeeklyMenu from './components/WeeklyMenu';
import Recommendations from './components/Recommendations';

const RestaurantPage = () => {
  const [activeTab, setActiveTab] = useState('main');

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Restaurant</h1>

        {/* Main Tabs */}
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('main')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'main'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Main
          </button>
          <button
            onClick={() => setActiveTab('weekly-menu')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'weekly-menu'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Weekly Menu
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'recommendations'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Recommendations
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'main' && <Main />}
        {activeTab === 'weekly-menu' && <WeeklyMenu />}
        {activeTab === 'recommendations' && <Recommendations />}
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

export default RestaurantPage;

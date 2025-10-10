import React, { useState } from 'react';
import Main from './components/Main';
import WeeklyMenu from './components/WeeklyMenu';
import Recommendations from './components/Recommendations';

const RestaurantPage = () => {
  const [activeTab, setActiveTab] = useState('main');

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="content-section-heavy border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold valley-rose-text title-font mb-4">Restaurant</h1>

        {/* Main Tabs */}
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('main')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'main'
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={activeTab === 'main' ? {backgroundColor: 'var(--primary-color)'} : {}}
          >
            Main
          </button>
          <button
            onClick={() => setActiveTab('weekly-menu')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'weekly-menu'
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={activeTab === 'weekly-menu' ? {backgroundColor: 'var(--primary-color)'} : {}}
          >
            Weekly Menu
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'recommendations'
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={activeTab === 'recommendations' ? {backgroundColor: 'var(--primary-color)'} : {}}
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
      <div className="content-section-heavy border-t border-gray-200 px-6 py-4">
        <p className="text-center text-sm text-gray-500">
          © 2022-2025 by ValleyRose.com, Inc.
        </p>
      </div>
    </div>
  );
};

export default RestaurantPage;

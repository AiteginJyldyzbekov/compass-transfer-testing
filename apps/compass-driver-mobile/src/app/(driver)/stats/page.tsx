"use client";
import React, { useState } from 'react';
import StatisticsComponent from "@widgets/stats-order-history/StatisticComponent"
import OrderHistoryComponent from '@widgets/stats-order-history/OrderHistory';

export default function StatsPage() {
  const [currentView, setCurrentView] = useState('statistics');

  const handleViewChange = (view: any) => {
    console.log('Switching to:', view);
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Заголовок с табами */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => handleViewChange('statistics')}
            className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors ${currentView === 'statistics'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
          >
            Моя статистика
          </button>
          <button
            onClick={() => handleViewChange('orders')}
            className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors ${currentView === 'orders'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
          >
            История заказов
          </button>
        </div>

        {/* Контент */}
        <div key={currentView} className="transition-all duration-300">
          {currentView === 'statistics' && <StatisticsComponent />}
          {currentView === 'orders' && <OrderHistoryComponent />}
        </div>
      </div>
    </div>
  );
}
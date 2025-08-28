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
        <div className="flex">
          <button
            onClick={() => handleViewChange('statistics')}
            className={`flex-1 py-[5px] px-[4px] text-sm font-medium rounded-[7px] transition-colors ${currentView === 'statistics'
              ? 'text-[#0047FF] bg-[#0047FF1A]'
              : 'text-[#000000] bg-[#F9F9F9]'
              }`}
          >
            Моя статистика
          </button>
          <button
            onClick={() => handleViewChange('orders')}
            className={`flex-1 py-[5px] px-[4px] text-sm font-medium rounded-[7px] transition-colors ${currentView === 'orders'
              ? 'text-[#0047FF] bg-[#0047FF1A]'
              : 'text-[#000000] bg-[#F9F9F9]'
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
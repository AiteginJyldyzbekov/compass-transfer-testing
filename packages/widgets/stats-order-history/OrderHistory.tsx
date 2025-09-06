"use client";
import React, { useState } from 'react';

export default function OrderHistoryComponent() {
    const [activeTab, setActiveTab] = useState('completed');

    const orders = [
        {
            id: 1,
            client: 'Рудаметов Илим Саиитбекович',
            date: '12.01.25',
            time: '13:45',
            reference: 'PZ0890',
            status: 'completed'
        },
        {
            id: 2,
            client: 'Рудаметов Илим Саиитбекович',
            date: '12.01.25',
            time: '13:45',
            reference: 'PZ0890',
            status: 'completed'
        },
        {
            id: 3,
            client: 'Рудаметов Илим Саиитбекович',
            date: '12.01.25',
            time: '13:45',
            reference: 'PZ0890',
            status: 'completed'
        }
    ];

    return (
        <div className="bg-white min-h-screen mt-[10px]">
            {/* Табы */}
            <div className="flex bg-gray-100 rounded-3xl p-1 mx-4 mb-6">
                <button
                    onClick={() => setActiveTab('completed')}
                    className={`flex-1 py-3 px-6 text-base font-medium rounded-3xl transition-all ${activeTab === 'completed'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                        }`}
                >
                    Выполненные
                </button>
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`flex-1 py-3 px-6 text-base font-medium rounded-3xl transition-all ${activeTab === 'pending'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                        }`}
                >
                    Не выполненные
                </button>
            </div>

            {/* Список заказов */}
            <div className="px-4 space-y-3">
                {orders.map((order) => (
                    <div key={order.id} className="py-4 px-4 rounded-xl" style={{ backgroundColor: '#0047FF08' }}>
                        <div className="flex justify-between items-start gap-4">
                            {/* Левая часть - имя */}
                            <div className="flex-shrink-0 w-24 sm:w-32">
                                <h3 className="text-sm font-medium leading-tight" style={{ color: '#212227' }}>
                                    {order.client}
                                </h3>
                            </div>

                            {/* Правая часть - все остальные данные */}
                            <div className="flex flex-col items-end space-y-2 min-w-0 flex-1">
                                <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-8">
                                    <div className="flex flex-col items-center min-w-0 w-12 sm:w-16">
                                        <span className="text-xs font-medium truncate w-full text-center" style={{ color: '#212227' }}>{order.date}</span>
                                        <span className="text-xs" style={{ color: '#92929D' }}>Дата</span>
                                    </div>
                                    <div className="flex flex-col items-center min-w-0 w-12 sm:w-16">
                                        <span className="text-xs font-medium truncate w-full text-center" style={{ color: '#212227' }}>{order.time}</span>
                                        <span className="text-xs" style={{ color: '#92929D' }}>Время</span>
                                    </div>
                                    <div className="flex flex-col items-center min-w-0 w-12 sm:w-16">
                                        <span className="text-xs font-medium truncate w-full text-center" style={{ color: '#212227' }}>{order.reference}</span>
                                        <span className="text-xs" style={{ color: '#92929D' }}>Рейс</span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-8">
                                    <div className="flex flex-col items-center w-12 sm:w-16">
                                        <span className="text-sm" style={{ color: '#212227' }}>Статус</span>
                                    </div>
                                    <div className="flex flex-col items-center w-12 sm:w-16">
                                        {/* Пустое место под временем */}
                                    </div>
                                    <div className="flex flex-col items-center w-12 sm:w-16">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></div>
                                            <span className="text-green-600 text-sm font-medium whitespace-nowrap">Завершен</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
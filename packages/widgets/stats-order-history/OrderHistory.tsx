"use client";
import React, { useState } from 'react';

export default function OrderHistoryComponent() {
    const [activeTab, setActiveTab] = useState('completed');

    const orders = [
        {
            id: 1,
            client: 'Рудометов Илья Сергеевич',
            date: '12.01.25',
            time: '13:45',
            amount: '750 ₽',
            status: 'completed'
        },
        {
            id: 2,
            client: 'Рудометов Илья Сергеевич',
            date: '12.01.25',
            time: '13:45',
            amount: '750 ₽',
            status: 'completed'
        },
        {
            id: 3,
            client: 'Рудометов Илья Сергеевич',
            date: '12.01.25',
            time: '13:45',
            amount: '750 ₽',
            status: 'completed'
        }
    ];

    return (
        <div className="p-6 bg-white">
            {/* Табы */}
            <div className="flex mb-6">
                <button
                    onClick={() => setActiveTab('completed')}
                    className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg mr-2 ${activeTab === 'completed'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                        }`}
                >
                    Выполненные
                </button>
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg ${activeTab === 'pending'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                        }`}
                >
                    Не выполненные
                </button>
            </div>

            {/* Список заказов */}
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900 mb-1">{order.client}</h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span>{order.date}</span>
                                    <span>{order.time}</span>
                                    <span>{order.amount}</span>
                                </div>
                                <div className="text-xs text-gray-400 mt-1">Статус</div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                    ● Завершен
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
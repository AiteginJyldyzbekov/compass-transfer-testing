"use client";
import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export default function StatisticsComponent() {
    const chartData = [
        { day: 'ПН', value: 15 },
        { day: 'ВТ', value: 25 },
        { day: 'СР', value: 20 },
        { day: 'ЧТ', value: 35 },
        { day: 'ПТ', value: 30 },
        { day: 'СБ', value: 28 },
        { day: 'ВС', value: 32 }
    ];

    return (
        <div className="p-6 bg-white">
            {/* Заголовки с фильтрами */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600 text-sm">Количество рассчих дней</span>
                        <select className="text-sm text-gray-600 bg-transparent">
                            <option>Март ▼</option>
                        </select>
                    </div>
                    <div className="relative w-20 h-20">
                        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="3"
                            />
                            <path
                                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="3"
                                strokeDasharray="66, 100"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold">20</span>
                            <span className="text-xs text-gray-500">дней</span>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600 text-sm">Заработано</span>
                        <select className="text-sm text-gray-600 bg-transparent">
                            <option>Март ▼</option>
                        </select>
                    </div>
                    <div className="relative w-20 h-20">
                        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="3"
                            />
                            <path
                                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="3"
                                strokeDasharray="88, 100"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-lg font-bold">45 000</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* График заработка */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600 text-sm">График заработка</span>
                    <select className="text-sm text-gray-600 bg-transparent">
                        <option>Неделя ▼</option>
                    </select>
                </div>

                <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#9ca3af' }}
                            />
                            <YAxis hide />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Индикатор */}
                <div className="flex justify-center mt-4">
                    <div className="bg-black text-white px-3 py-1 rounded-full text-xs">
                        23 945 ₽
                    </div>
                </div>
            </div>
        </div>
    );
}
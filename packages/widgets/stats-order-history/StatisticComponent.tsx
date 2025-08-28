"use client";
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function StatisticsComponent() {
    const [workingDaysMonth, setWorkingDaysMonth] = useState('март');
    const [earningsMonth, setEarningsMonth] = useState('март');
    const [chartPeriod, setChartPeriod] = useState('неделя');

    const monthOptions = [
        { value: 'январь', label: 'Январь' },
        { value: 'февраль', label: 'Февраль' },
        { value: 'март', label: 'Март' },
        { value: 'апрель', label: 'Апрель' },
        { value: 'май', label: 'Май' },
        { value: 'июнь', label: 'Июнь' },
        { value: 'июль', label: 'Июль' },
        { value: 'август', label: 'Август' },
        { value: 'сентябрь', label: 'Сентябрь' },
        { value: 'октябрь', label: 'Октябрь' },
        { value: 'ноябрь', label: 'Ноябрь' },
        { value: 'декабрь', label: 'Декабрь' }
    ];

    const periodOptions = [
        { value: 'неделя', label: 'Неделя' },
        { value: 'месяц', label: 'Месяц' },
        { value: 'квартал', label: 'Квартал' },
        { value: 'год', label: 'Год' }
    ];

    const chartData = [
        { day: 'ПН', value: 15, amount: '15 450 ₽' },
        { day: 'ВТ', value: 25, amount: '25 320 ₽' },
        { day: 'СР', value: 20, amount: '20 180 ₽' },
        { day: 'ЧТ', value: 35, amount: '35 890 ₽' },
        { day: 'ПТ', value: 30, amount: '30 675 ₽' },
        { day: 'СБ', value: 28, amount: '28 240 ₽' },
        { day: 'ВС', value: 32, amount: '32 450 ₽' }
    ];

    // Кастомный тултип
    const CustomTooltip = ({ active, payload, label }:any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black text-white px-3 py-2 rounded-full text-sm font-medium shadow-lg">
                    {payload[0].payload.amount}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            {/* Верхняя секция с кружочками */}
            <div className="flex justify-between items-start mb-8 gap-4">
                {/* Левый кружок */}
                <div className="flex-1">
                    <div className="text-center mb-3">
                        <span className="text-gray-700 text-sm font-medium block mb-2">Количество рабочих дней</span>
                       <div className="relative inline-block">
                            <select
                                value={earningsMonth}
                                onChange={(e) => setEarningsMonth(e.target.value)}
                                 className="appearance-none py-[7px] px-[20px] bg-[#E6E6E6] rounded-full text-sm text-gray-600 pr-6 cursor-pointer focus:outline-none"
                            >
                                {monthOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <svg className="absolute right-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="relative w-24 h-24">
                            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
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
                                <span className="text-2xl font-bold text-gray-900">20</span>
                                <span className="text-xs text-gray-500">дней</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Правый кружок */}
                <div className="flex-1">
                    <div className="text-center mb-3">
                        <span className="text-gray-700 text-sm font-medium block mb-2">Итого денег</span>
                        <div className="relative inline-block">
                            <select
                                value={earningsMonth}
                                onChange={(e) => setEarningsMonth(e.target.value)}
                                 className="appearance-none py-[7px] px-[20px] bg-[#E6E6E6] rounded-full text-sm text-gray-600 pr-6 cursor-pointer focus:outline-none"
                            >
                                {monthOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <svg className="absolute right-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="relative w-24 h-24">
                            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
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
                                <span className="text-lg font-bold text-gray-900">45 000</span>
                                <span className="text-xs text-gray-500">Сом</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* График заработка */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <span className="text-gray-700 text-sm font-medium">График заработка</span>
                    <div className="relative bg-gray-100 rounded-full px-3 py-1">
                        <select
                            value={chartPeriod}
                            onChange={(e) => setChartPeriod(e.target.value)}
                            className="appearance-none bg-transparent text-sm text-gray-600 pr-6 cursor-pointer focus:outline-none"
                        >
                            {periodOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                <div className="h-48 w-full mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#9ca3af' }}
                            />
                            <YAxis hide />
                            <Tooltip
                                content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />}
                                cursor={{ stroke: 'transparent' }}
                                position={{ y: -10 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }}
                                activeDot={{ r: 6, fill: '#3b82f6' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
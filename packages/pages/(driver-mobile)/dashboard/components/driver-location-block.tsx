"use client";

import { useState } from 'react';

const DriverLocation = () => {
    const [currentLocation, setCurrentLocation] = useState('На линии');

    // Конфигурация локаций
    const locations = [
        {
            id: 'airport',
            label: 'Аэропорт',
            color: 'bg-blue-500'
        },
        {
            id: 'ala-archa',
            label: 'Ала-Арча',
            color: 'bg-green-500'
        },
        {
            id: 'online',
            label: 'На линии',
            color: 'bg-orange-500'
        }
    ];

    // Функция для получения текущей локации
    const getCurrentLocationConfig = () => {
        return locations.find(location => location.label === currentLocation) || locations[2];
    };

    return (
        <>
            {/* Основной блок локации */}
            <div
                className="bg-gray-50 rounded-lg p-4 w-full cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => window.dispatchEvent(new CustomEvent('openDriverLocationModal'))}
            >
                <div className="flex items-center gap-2">
                    <div
                        className={`w-2 h-2 rounded-full ${getCurrentLocationConfig().color}`}
                    ></div>
                    <span className="text-sm text-gray-900 font-medium">
                        {currentLocation}
                    </span>
                </div>
            </div>
        </>
    );
};

export default DriverLocation;
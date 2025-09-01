"use client";

import { useState } from 'react';

const DriverLocation = () => {
    const [currentLocation, setCurrentLocation] = useState('На линии');
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    // API функции (готовые для подключения)
    const fetchCurrentLocation = async () => {
        try {
            // const response = await fetch('/api/location');
            // const data = await response.json();
            // setCurrentLocation(data.location);
            console.log('Fetching current location...');
        } catch (error) {
            console.error('Error fetching location:', error);
        }
    };

    const updateLocation = async (newLocation: any) => {
        try {
            // const response = await fetch('/api/location', {
            //   method: 'PUT',
            //   headers: {
            //     'Content-Type': 'application/json',
            //   },
            //   body: JSON.stringify({ location: newLocation }),
            // });
            // 
            // if (response.ok) {
            //   setCurrentLocation(newLocation);
            //   setIsModalOpen(false);
            // }

            // Временная логика для демонстрации
            setCurrentLocation(newLocation);
            setIsModalOpen(false);
            console.log('Location updated to:', newLocation);
        } catch (error) {
            console.error('Error updating location:', error);
        }
    };

    return (
        <>
            {/* Основной блок локации */}
            <div
                className="bg-gray-50 rounded-lg p-4 w-full cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setIsModalOpen(true)}
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

            {/* Модальное окно */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10000">
                    <div
                        className="bg-white rounded-2xl p-6 w-64 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="space-y-3">
                            {locations.map((location) => (
                                <button
                                    key={location.id}
                                    onClick={() => updateLocation(location.label)}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <div
                                        className={`w-2 h-2 rounded-full ${location.color}`}
                                    ></div>
                                    <span className="text-sm text-gray-900 font-medium">
                                        {location.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Overlay для закрытия модального окна */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsModalOpen(false)}
                ></div>
            )}
        </>
    );
};

export default DriverLocation;
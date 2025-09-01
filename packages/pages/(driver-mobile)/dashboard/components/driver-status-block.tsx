"use client";

import { useState } from 'react';

const DriverStatusBlock = () => {
    const [currentStatus, setCurrentStatus] = useState('Работаю');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Конфигурация статусов
    const statuses = [
        {
            id: 'working',
            label: 'Работаю',
            color: 'bg-green-500'
        },
        {
            id: 'lunch',
            label: 'Обедаю',
            color: 'bg-yellow-500'
        },
        {
            id: 'offline',
            label: 'Выходной',
            color: 'bg-red-500'
        }
    ];

    // Функция для получения текущего статуса
    const getCurrentStatusConfig = () => {
        return statuses.find(status => status.label === currentStatus) || statuses[0];
    };

    // API функции (готовые для подключения)
    const fetchCurrentStatus = async () => {
        try {
            // const response = await fetch('/api/status');
            // const data = await response.json();
            // setCurrentStatus(data.status);
            console.log('Fetching current status...');
        } catch (error) {
            console.error('Error fetching status:', error);
        }
    };

    const updateStatus = async (newStatus: any) => {
        try {
            // const response = await fetch('/api/status', {
            //   method: 'PUT',
            //   headers: {
            //     'Content-Type': 'application/json',
            //   },
            //   body: JSON.stringify({ status: newStatus }),
            // });
            // 
            // if (response.ok) {
            //   setCurrentStatus(newStatus);
            //   setIsModalOpen(false);
            // }

            // Временная логика для демонстрации
            setCurrentStatus(newStatus);
            setIsModalOpen(false);
            console.log('Status updated to:', newStatus);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {/* Основной блок статуса */}
            <div className="bg-gray-50 rounded-lg p-4 w-full mb-20">
                <div className="flex items-center justify-between gap-8">
                    <div className="text-sm text-gray-600 font-medium">
                        Статус работы
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                    >
                        Изменить
                    </button>
                </div>

                <div className="flex items-center gap-2 mt-2">
                    <div
                        className={`w-2 h-2 rounded-full ${getCurrentStatusConfig().color}`}
                    ></div>
                    <span className="text-sm text-gray-900 font-medium">
                        {currentStatus}
                    </span>
                </div>
            </div>

            {/* Модальное окно */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
                    onClick={handleCloseModal}
                    style={{ zIndex: 9999 }}
                >
                    <div
                        className="bg-white rounded-2xl p-6 w-64 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                        style={{ zIndex: 10000 }}
                    >
                        <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
                            Выберите статус
                        </h3>
                        <div className="space-y-3">
                            {statuses.map((status) => (
                                <button
                                    key={status.id}
                                    onClick={() => updateStatus(status.label)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${currentStatus === status.label
                                        ? 'bg-blue-50 border-2 border-blue-200'
                                        : 'hover:bg-gray-50 border-2 border-transparent'
                                        }`}
                                >
                                    <div
                                        className={`w-3 h-3 rounded-full ${status.color}`}
                                    ></div>
                                    <span className="text-sm text-gray-900 font-medium">
                                        {status.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DriverStatusBlock;
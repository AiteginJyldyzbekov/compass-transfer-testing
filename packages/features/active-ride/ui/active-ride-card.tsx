'use client';

import { Clock, MapPin, User, Navigation } from 'lucide-react';
import React from 'react';
import { Button } from '@shared/ui/forms';
import { Card } from '@shared/ui/layout';
import { useActiveRide } from '../context/active-ride-context';

export function ActiveRideCard() {
  const { activeRides, isLoading, error, hasActiveRide } = useActiveRide();

  if (isLoading) {
    return (
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 mr-2 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-600">Загрузка активных поездок...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 mb-4 border-red-200 bg-red-50">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-3"/>
          <div>
            <p className="text-sm font-medium text-red-800">Ошибка загрузки поездок</p>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!hasActiveRide || !activeRides?.data?.length) {
    return null; // Не показываем карточку, если нет активных поездок
  }

  const activeRide = activeRides.data[0]; // Берем первую активную поездку

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'Принята';
      case 'Arrived':
        return 'Прибыл';
      case 'InProgress':
        return 'В пути';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-blue-500';
      case 'Arrived':
        return 'bg-yellow-500';
      case 'InProgress':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="p-4 mb-4 border-blue-200 bg-blue-50">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-3 ${getStatusColor(activeRide.status)}`} />
          <div>
            <h3 className="font-semibold text-blue-900">Активная поездка</h3>
            <p className="text-sm text-blue-700">{getStatusText(activeRide.status)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-blue-600">Заказ #{activeRide.orderId?.slice(-8)}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {/* Клиент */}
        {activeRide.customerName && (
          <div className="flex items-center text-sm">
            <User className="w-4 h-4 mr-2 text-blue-600" />
            <span className="text-gray-700">{activeRide.customerName}</span>
          </div>
        )}

        {/* Время */}
        <div className="flex items-center text-sm">
          <Clock className="w-4 h-4 mr-2 text-blue-600" />
          <span className="text-gray-700">
            Запланировано на {formatTime(activeRide.scheduledTime)}
          </span>
        </div>

        {/* Маршрут */}
        <div className="space-y-1">
          <div className="flex items-start text-sm">
            <MapPin className="w-4 h-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{activeRide.fromAddress}</span>
          </div>
          <div className="flex items-start text-sm">
            <MapPin className="w-4 h-4 mr-2 text-red-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{activeRide.toAddress}</span>
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => {
            // TODO: Открыть детали поездки
            console.log('Открыть детали поездки:', activeRide.id);
          }}
        >
          Детали
        </Button>
        <Button 
          size="sm" 
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            // TODO: Построить маршрут
            console.log('Построить маршрут к:', activeRide.fromAddress);
          }}
        >
          <Navigation className="w-4 h-4 mr-1" />
          Маршрут
        </Button>
      </div>
    </Card>
  );
}

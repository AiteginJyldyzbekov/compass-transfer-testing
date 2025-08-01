'use client';

import React from 'react';
import type { GetDriverDTO } from '@entities/users/interface';
import { LeafletMap } from '@shared/components/map';

interface DriverLocationInfoProps {
  driver: GetDriverDTO;
}

export function DriverLocationInfo({ driver }: DriverLocationInfoProps) {
  // Проверяем, есть ли данные о местоположении
  const hasLocation = driver.currentLocation &&
    driver.currentLocation.latitude &&
    driver.currentLocation.longitude;

  // Создаем данные для отображения водителя на карте
  const activeDrivers = hasLocation ? [{
    id: driver.id,
    type: driver.activeCar?.type || 'Sedan',
    serviceClass: driver.activeCar?.serviceClass || 'Economy',
    currentLocation: {
      latitude: driver.currentLocation!.latitude,
      longitude: driver.currentLocation!.longitude,
    }
  }] : [];

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Расположение на карте</h3>

      {hasLocation ? (
        <div className='rounded-lg border overflow-hidden'>
          <LeafletMap
            latitude={driver.currentLocation!.latitude}
            longitude={driver.currentLocation!.longitude}
            zoom={15}
            height='300px'
            width='100%'
            showMarker={false}
            activeDrivers={activeDrivers}
            showActiveDrivers={true}
            selectedDriverId={driver.id}
            className='rounded-lg'
          />
          <div className='p-3 bg-gray-50 border-t'>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-muted-foreground'>Статус:</span>
              <span className={`font-medium ${driver.online ? 'text-green-600' : 'text-gray-500'}`}>
                {driver.online ? 'Онлайн' : 'Оффлайн'}
              </span>
            </div>
            <div className='flex justify-between items-center text-sm mt-1'>
              <span className='text-muted-foreground'>Координаты:</span>
              <span className='font-mono text-xs'>
                {driver.currentLocation!.latitude.toFixed(6)}, {driver.currentLocation!.longitude.toFixed(6)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className='p-4 rounded-lg border bg-gray-50 border-gray-200 h-64 flex items-center justify-center'>
          <div className='text-center'>
            <div className='text-4xl mb-2'>📍</div>
            <p className='text-muted-foreground'>Местоположение недоступно</p>
            <p className='text-sm text-muted-foreground mt-1'>
              Статус: {driver.online ? 'Онлайн' : 'Оффлайн'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

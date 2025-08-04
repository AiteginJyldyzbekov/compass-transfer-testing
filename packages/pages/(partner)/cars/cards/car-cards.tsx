'use client';

import { useState, useEffect, useRef } from 'react';
import { carsApi } from '@shared/api/cars';
import { VehicleStatus } from '@entities/cars/enums';
import type { GetCarDTO } from '@entities/cars/interface';
import { PremiumCarShowcase } from '@pages/(admin)/dashboard/operator/components/premium-car-showcase';

interface CarCardsProps {
  onCarClick?: (car: GetCarDTO) => void;
  onFirstCarLoaded?: (car: GetCarDTO) => void;
  userRole?: 'admin' | 'operator' | 'partner' | 'driver';
}

export function CarCards({ onFirstCarLoaded, userRole }: CarCardsProps) {
  const [cars, setCars] = useState<GetCarDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFirstLoadRef = useRef(true);

  // Загрузка автомобилей
  useEffect(() => {
    const loadCars = async () => {
      try {
        setIsLoading(true);

        const response = await carsApi.getCars({
          size: 50,
          first: true,
          sortBy: 'make',
          sortOrder: 'Asc',
          status: [VehicleStatus.Available], // API ожидает массив статусов
        });

        setCars(response.data);

        // Вызываем колбэк для первого автомобиля только один раз
        if (isFirstLoadRef.current && response.data.length > 0 && onFirstCarLoaded) {
          onFirstCarLoaded(response.data[0]);
          isFirstLoadRef.current = false;
        }
      } catch (_err) {
        // Игнорируем ошибки, PremiumCarShowcase покажет пустое состояние
      } finally {
        setIsLoading(false);
      }
    };

    loadCars();
  }, [onFirstCarLoaded]);

  return (
    <PremiumCarShowcase
      cars={cars}
      isLoading={isLoading}
      tariffName="Доступные автомобили"
      cardWidth={400}
      userRole={userRole}
    />
  );
}

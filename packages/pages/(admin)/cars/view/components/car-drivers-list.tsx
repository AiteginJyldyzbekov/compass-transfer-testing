'use client';

import { useState, useEffect } from 'react';
import { User, Calendar, CheckCircle, XCircle, Trash2, Eye } from 'lucide-react';
import { Badge } from '@shared/ui/data-display/badge';
import { Button } from '@shared/ui/forms/button';
import { Skeleton } from '@shared/ui/data-display/skeleton';
import { DeleteConfirmationModal } from '@shared/ui/modals/delete-confirmation-modal';
import { usersApi } from '@shared/api/users';
import { useUserRole } from '@shared/contexts';
import { Role } from '@entities/users/enums';
import { DriverSheet } from '@widgets/sidebar/ui/driver-sheet';
import type { GetUserBasicDTO, GetDriverDTO } from '@entities/users/interface';

interface Driver {
  driverId: string;
  isActive: boolean;
  assignedAt: string;
}

interface CarDriversListProps {
  carId: string;
  drivers: Driver[];
  onRemoveDriver?: (driverId: string) => Promise<void>;
}

interface DriverWithDetails extends Driver {
  details?: GetUserBasicDTO;
  loading?: boolean;
  error?: string;
}

export function CarDriversList({ carId, drivers, onRemoveDriver }: CarDriversListProps) {
  const { userRole } = useUserRole();
  const [driversWithDetails, setDriversWithDetails] = useState<DriverWithDetails[]>([]);
  const [removingDriverId, setRemovingDriverId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<DriverWithDetails | null>(null);
  const [selectedDriverForSheet, setSelectedDriverForSheet] = useState<GetDriverDTO | null>(null);
  const [isDriverSheetOpen, setIsDriverSheetOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('main');
  const [activeOrderType, setActiveOrderType] = useState('scheduled');

  // Проверяем права доступа
  const canRemoveDriver = userRole !== Role.Operator;

  useEffect(() => {
    const loadDriversDetails = async () => {
      // Инициализируем состояние с загрузкой
      setDriversWithDetails(
        drivers.map(driver => ({ ...driver, loading: true }))
      );

      // Загружаем детали каждого водителя
      const driversPromises = drivers.map(async (driver) => {
        try {
          const details = await usersApi.getUserById(driver.driverId);
          return { ...driver, details, loading: false };
        } catch (error) {
          console.error(`Ошибка загрузки водителя ${driver.driverId}:`, error);
          return { 
            ...driver, 
            loading: false, 
            error: error instanceof Error ? error.message : 'Ошибка загрузки' 
          };
        }
      });

      const results = await Promise.all(driversPromises);
      setDriversWithDetails(results);
    };

    if (drivers.length > 0) {
      loadDriversDetails();
    } else {
      setDriversWithDetails([]);
    }
  }, [drivers]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRemoveDriverClick = (driver: DriverWithDetails) => {
    setDriverToDelete(driver);
    setIsDeleteModalOpen(true);
  };

  const handleRemoveDriverConfirm = async () => {
    if (!onRemoveDriver || !driverToDelete) return;

    try {
      setRemovingDriverId(driverToDelete.driverId);
      await onRemoveDriver(driverToDelete.driverId);
      setIsDeleteModalOpen(false);
      setDriverToDelete(null);
    } catch (error) {
      console.error('Ошибка удаления водителя:', error);
    } finally {
      setRemovingDriverId(null);
    }
  };

  const handleOpenDriverSheet = async (driver: DriverWithDetails) => {
    if (!driver.details) return;

    try {
      // Получаем полную информацию о водителе
      const fullDriverData = await usersApi.getDriver(driver.driverId);
      setSelectedDriverForSheet(fullDriverData);
      setIsDriverSheetOpen(true);
    } catch (error) {
      console.error('Ошибка загрузки данных водителя:', error);
    }
  };

  const handleCloseDriverSheet = () => {
    setIsDriverSheetOpen(false);
    setSelectedDriverForSheet(null);
    setActiveCategory('main');
    setActiveOrderType('scheduled');
  };

  if (drivers.length === 0) {
    return (
      <div className='text-center py-8'>
        <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          <User className='h-8 w-8 text-gray-400' />
        </div>
        <p className='text-gray-500 text-sm'>
          К этому автомобилю не назначены водители
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {driversWithDetails.map((driver) => (
        <div
          key={driver.driverId}
          className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors'
        >
          <div className='flex items-start justify-between'>
            <div className='flex items-start gap-3'>
              <div className='flex-shrink-0'>
                <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                  <User className='h-5 w-5 text-blue-600' />
                </div>
              </div>

              <div className='flex-1 min-w-0'>
                {driver.loading ? (
                  <div className='space-y-2'>
                    <Skeleton className='h-5 w-48' />
                    <Skeleton className='h-4 w-32' />
                  </div>
                ) : driver.error ? (
                  <div>
                    <p className='font-medium text-red-600'>Ошибка загрузки</p>
                    <p className='text-sm text-red-500'>{driver.error}</p>
                  </div>
                ) : driver.details ? (
                  <div>
                    <div className='flex items-center gap-2 mb-1'>
                      <p className='font-medium text-gray-900 truncate'>
                        {driver.details.fullName}
                      </p>
                      <Badge variant={driver.isActive ? 'default' : 'secondary'} className='text-xs'>
                        {driver.isActive ? 'Активен' : 'Неактивен'}
                      </Badge>
                    </div>
                    <p className='text-sm text-gray-600 mb-2'>
                      {driver.details.email}
                    </p>
                    <div className='flex items-center gap-1 text-xs text-gray-500'>
                      <Calendar className='h-3 w-3' />
                      <span>Назначен: {formatDate(driver.assignedAt)}</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className='font-medium text-gray-900'>ID: {driver.driverId}</p>
                    <p className='text-sm text-gray-500'>Детали недоступны</p>
                  </div>
                )}
              </div>
            </div>

            <div className='flex items-center gap-2'>
              {driver.isActive ? (
                <CheckCircle className='h-5 w-5 text-green-500' />
              ) : (
                <XCircle className='h-5 w-5 text-gray-400' />
              )}

              {/* Кнопка просмотра */}
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleOpenDriverSheet(driver)}
                className='h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50'
              >
                <Eye className='h-4 w-4' />
              </Button>

              {canRemoveDriver && onRemoveDriver && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => handleRemoveDriverClick(driver)}
                  disabled={removingDriverId === driver.driverId}
                  className='h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Модальное окно подтверждения удаления */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDriverToDelete(null);
        }}
        onConfirm={handleRemoveDriverConfirm}
        title="Удалить привязку водителя"
        description={
          driverToDelete?.details
            ? `Вы уверены, что хотите удалить привязку водителя "${driverToDelete.details.fullName}" к этому автомобилю? Это действие нельзя отменить.`
            : 'Вы уверены, что хотите удалить привязку водителя к этому автомобилю?'
        }
      />

      {/* DriverSheet для просмотра водителя */}
      <DriverSheet
        isOpen={isDriverSheetOpen}
        onClose={handleCloseDriverSheet}
        driver={selectedDriverForSheet}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        activeOrderType={activeOrderType}
        setActiveOrderType={setActiveOrderType}
      />
    </div>
  );
}

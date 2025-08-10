'use client';

import { Search, User, Plus, Loader2, Filter, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { usersApi } from '@shared/api/users';
import { Badge } from '@shared/ui/data-display/badge';
import { Skeleton } from '@shared/ui/data-display/skeleton';
import { Button } from '@shared/ui/forms/button';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/forms/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/modals/dialog';
import type { GetDriverDTO } from '@entities/users/interface';
import { DriverSheet } from '@widgets/sidebar/ui/driver-sheet';

interface AddDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDriver: (driverId: string) => Promise<void>;
  assignedDriverIds?: string[]; // ID уже назначенных водителей
}

export function AddDriverModal({
  isOpen,
  onClose,
  onAddDriver,
  assignedDriverIds = []
}: AddDriverModalProps) {
  const [drivers, setDrivers] = useState<GetDriverDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [addingDriverId, setAddingDriverId] = useState<string | null>(null);
  const [selectedDriverForSheet, setSelectedDriverForSheet] = useState<GetDriverDTO | null>(null);
  const [isDriverSheetOpen, setIsDriverSheetOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('main');
  const [activeOrderType, setActiveOrderType] = useState('scheduled');

  // Состояния фильтров
  const [filters, setFilters] = useState({
    online: undefined as boolean | undefined,
    drivingExperience: undefined as number | undefined,
    drivingExperienceOp: 'GreaterThanOrEqual' as 'GreaterThan' | 'GreaterThanOrEqual' | 'Equal' | 'LessThanOrEqual' | 'LessThan',
  });

  // Загрузка водителей
  useEffect(() => {
    const loadDrivers = async () => {
      if (!isOpen) return;

      try {
        setLoading(true);
        const params: Record<string, string | number | boolean | string[]> = {
          size: 50,
        };

        // Поиск по имени или телефону
        if (searchQuery.trim()) {
          const query = searchQuery.trim();

          // Если первый символ - цифра или +, ищем по телефону
          if (/^[\d+]/.test(query)) {
            params.phoneNumber = query;
            params.phoneNumberOp = 'Contains';
          } else {
            // Иначе ищем по имени
            params.fullName = query;
            params.fullNameOp = 'Contains';
          }
        }

        // Применяем фильтры
        if (filters.online !== undefined) {
          params.online = filters.online;
        }

        if (filters.drivingExperience !== undefined) {
          params.drivingExperience = filters.drivingExperience;
          params.drivingExperienceOp = filters.drivingExperienceOp;
        }

        const response = await usersApi.getDrivers(params);

        // Исключаем уже назначенных водителей
        const availableDrivers = response.data.filter(
          driver => !assignedDriverIds.includes(driver.id)
        );

        setDrivers(availableDrivers);
      } catch {
        toast.error('Ошибка загрузки водителей:');
        setDrivers([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(loadDrivers, 300);

    return () => clearTimeout(timeoutId);
  }, [isOpen, searchQuery, assignedDriverIds, filters.online, filters.drivingExperience, filters.drivingExperienceOp]);



  const handleAddDriver = async (driverId: string) => {
    try {
      setAddingDriverId(driverId);
      await onAddDriver(driverId);
      onClose();
    } catch {
      toast.error('Ошибка добавления водителя:');
    } finally {
      setAddingDriverId(null);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setShowFilters(false);
    setAddingDriverId(null);
    setSelectedDriverForSheet(null);
    setIsDriverSheetOpen(false);
    onClose();
  };

  const handleOpenDriverSheet = (driver: GetDriverDTO) => {
    setSelectedDriverForSheet(driver);
    setIsDriverSheetOpen(true);
  };

  const handleCloseDriverSheet = () => {
    setIsDriverSheetOpen(false);
    setSelectedDriverForSheet(null);
    setActiveCategory('main');
    setActiveOrderType('scheduled');
  };

  const resetFilters = () => {
    setFilters({
      online: undefined,
      drivingExperience: undefined,
      drivingExperienceOp: 'GreaterThanOrEqual',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Добавить водителя к автомобилю</DialogTitle>
          </div>
        </DialogHeader>

        <div className='flex flex-col gap-4 flex-1 min-h-0'>
          {/* Поиск и фильтры */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  placeholder='Поиск по имени или телефону (начните с цифры или + для поиска по телефону)...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10'
                />
              </div>
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Фильтры
              </Button>
            </div>

            {/* Панель фильтров */}
            {showFilters && (
              <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Фильтры</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-xs"
                  >
                    Сбросить
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Статус онлайн */}
                  <div className="space-y-2">
                    <Label htmlFor="online-filter">Статус</Label>
                    <Select
                      value={filters.online === undefined ? 'all' : filters.online.toString()}
                      onValueChange={(value) =>
                        setFilters(prev => ({
                          ...prev,
                          online: value === 'all' ? undefined : value === 'true'
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Все" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все</SelectItem>
                        <SelectItem value="true">Онлайн</SelectItem>
                        <SelectItem value="false">Оффлайн</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Опыт вождения */}
                  <div className="space-y-2">
                    <Label htmlFor="experience-filter">Опыт вождения (лет)</Label>
                    <div className="flex gap-2">
                      <Select
                        value={filters.drivingExperienceOp}
                        onValueChange={(value) =>
                          setFilters(prev => ({
                            ...prev,
                            drivingExperienceOp: value as typeof filters.drivingExperienceOp
                          }))
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GreaterThanOrEqual">≥</SelectItem>
                          <SelectItem value="GreaterThan">&gt;</SelectItem>
                          <SelectItem value="Equal">=</SelectItem>
                          <SelectItem value="LessThanOrEqual">≤</SelectItem>
                          <SelectItem value="LessThan">&lt;</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="Лет"
                        value={filters.drivingExperience || ''}
                        onChange={(e) =>
                          setFilters(prev => ({
                            ...prev,
                            drivingExperience: e.target.value ? parseInt(e.target.value, 10) : undefined
                          }))
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Список водителей */}
          <div className='flex-1 overflow-y-auto border rounded-lg'>
            {loading ? (
              <div className='p-4 space-y-3'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className='flex items-center gap-3 p-3'>
                    <Skeleton className='w-10 h-10 rounded-full' />
                    <div className='flex-1 space-y-2'>
                      <Skeleton className='h-4 w-48' />
                      <Skeleton className='h-3 w-32' />
                    </div>
                    <Skeleton className='h-8 w-20' />
                  </div>
                ))}
              </div>
            ) : drivers.length === 0 ? (
              <div className='p-8 text-center'>
                <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <User className='h-8 w-8 text-gray-400' />
                </div>
                <p className='text-gray-500'>
                  {searchQuery ? 'Водители не найдены' : 'Нет доступных водителей'}
                </p>
              </div>
            ) : (
              <div className='divide-y'>
                {drivers.map((driver) => (
                  <div
                    key={driver.id}
                    className='flex items-center justify-between p-4 hover:bg-gray-50'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                        <User className='h-5 w-5 text-blue-600' />
                      </div>
                      <div>
                        <p className='font-medium text-gray-900'>{driver.fullName}</p>
                        <p className='text-sm text-gray-600'>{driver.email}</p>
                        <div className='flex items-center gap-2 mt-1'>
                          <Badge variant='outline' className='text-xs'>
                            {driver.phoneNumber}
                          </Badge>
                          {driver.online && (
                            <Badge variant='default' className='text-xs'>
                              Онлайн
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size='sm'
                        onClick={() => handleOpenDriverSheet(driver)}
                        className='flex items-center gap-2'
                      >
                        <Eye className='h-4 w-4' />
                        Просмотр
                      </Button>
                      <Button
                        size='sm'
                        onClick={() => handleAddDriver(driver.id)}
                        disabled={addingDriverId === driver.id}
                        className='flex items-center gap-2'
                      >
                        {addingDriverId === driver.id ? (
                          <Loader2 className='h-4 w-4 animate-spin' />
                        ) : (
                          <Plus className='h-4 w-4' />
                        )}
                        Добавить
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Кнопки */}
          <div className='flex justify-end gap-3 pt-4 border-t'>
            <Button variant='outline' onClick={handleClose}>
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>

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
    </Dialog>
  );
}

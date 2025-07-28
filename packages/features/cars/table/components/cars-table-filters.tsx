'use client';

import { Search, Filter, Columns, ChevronDown, X, Save } from 'lucide-react';
import { Badge } from '@shared/ui/data-display/badge';
import { Button } from '@shared/ui/forms/button';
import { Checkbox } from '@shared/ui/forms/checkbox';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/forms/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shared/ui/navigation/dropdown-menu';
import {
  CarColor,
  VehicleType,
  ServiceClass,
  VehicleStatus,
  type CarFeature,
} from '@entities/cars/enums';

interface ColumnVisibility {
  make: boolean;
  model: boolean;
  year: boolean;
  color: boolean;
  licensePlate: boolean;
  type: boolean;
  serviceClass: boolean;
  status: boolean;
  passengerCapacity: boolean;
  features: boolean;
  drivers: boolean;
}

interface CarsTableFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  makeFilter: string;
  setMakeFilter: (make: string) => void;
  modelFilter: string;
  setModelFilter: (model: string) => void;
  yearFilter: string;
  setYearFilter: (year: string) => void;
  colorFilter: CarColor[];
  handleColorFilterChange: (colors: CarColor[]) => void;
  licensePlateFilter: string;
  setLicensePlateFilter: (plate: string) => void;
  typeFilter: VehicleType[];
  handleTypeFilterChange: (types: VehicleType[]) => void;
  serviceClassFilter: ServiceClass[];
  handleServiceClassFilterChange: (classes: ServiceClass[]) => void;
  statusFilter: VehicleStatus[];
  handleStatusFilterChange: (statuses: VehicleStatus[]) => void;
  passengerCapacityFilter: string;
  setPassengerCapacityFilter: (capacity: string) => void;
  featuresFilter: CarFeature[];
  handleFeaturesFilterChange: (features: CarFeature[]) => void;
  pageSize: number;
  handlePageSizeChange: (size: number) => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
  columnVisibility: ColumnVisibility;
  handleColumnVisibilityChange: (column: keyof ColumnVisibility, visible: boolean) => void;
  onSaveFilters?: () => void;
  onClearSavedFilters?: () => void;
  hasSavedFilters?: boolean;
  justSavedFilters?: boolean;
}

// Переводы для enum значений
const colorLabels: Record<CarColor, string> = {
  [CarColor.Black]: 'Черный',
  [CarColor.White]: 'Белый',
  [CarColor.Silver]: 'Серебристый',
  [CarColor.Gray]: 'Серый',
  [CarColor.Red]: 'Красный',
  [CarColor.Blue]: 'Синий',
  [CarColor.Green]: 'Зеленый',
  [CarColor.Yellow]: 'Желтый',
  [CarColor.Brown]: 'Коричневый',
  [CarColor.Orange]: 'Оранжевый',
  [CarColor.Purple]: 'Фиолетовый',
  [CarColor.Gold]: 'Золотой',
  [CarColor.Other]: 'Другой',
};

const typeLabels: Record<VehicleType, string> = {
  [VehicleType.Sedan]: 'Седан',
  [VehicleType.Hatchback]: 'Хэтчбек',
  [VehicleType.SUV]: 'Внедорожник',
  [VehicleType.Minivan]: 'Минивэн',
  [VehicleType.Coupe]: 'Купе',
  [VehicleType.Cargo]: 'Грузовой',
  [VehicleType.Pickup]: 'Пикап',
};

const serviceClassLabels: Record<ServiceClass, string> = {
  [ServiceClass.Economy]: 'Эконом',
  [ServiceClass.Comfort]: 'Комфорт',
  [ServiceClass.ComfortPlus]: 'Комфорт+',
  [ServiceClass.Business]: 'Бизнес',
  [ServiceClass.Premium]: 'Премиум',
  [ServiceClass.Vip]: 'VIP',
  [ServiceClass.Luxury]: 'Люкс',
};

const statusLabels: Record<VehicleStatus, string> = {
  [VehicleStatus.Available]: 'Доступен',
  [VehicleStatus.Maintenance]: 'Обслуживание',
  [VehicleStatus.Repair]: 'Ремонт',
  [VehicleStatus.Other]: 'Другое',
};

export function CarsTableFilters({
  searchTerm,
  setSearchTerm,
  makeFilter,
  setMakeFilter,
  modelFilter,
  setModelFilter,
  yearFilter,
  setYearFilter,
  colorFilter,
  handleColorFilterChange,
  licensePlateFilter,
  setLicensePlateFilter,
  typeFilter,
  handleTypeFilterChange,
  serviceClassFilter,
  handleServiceClassFilterChange,
  statusFilter,
  handleStatusFilterChange,
  passengerCapacityFilter,
  setPassengerCapacityFilter,
  featuresFilter,
  handleFeaturesFilterChange,
  pageSize,
  handlePageSizeChange,
  showAdvancedFilters,
  setShowAdvancedFilters,
  columnVisibility,
  handleColumnVisibilityChange,
  onSaveFilters,
  onClearSavedFilters,
  hasSavedFilters,
  justSavedFilters,
}: CarsTableFiltersProps) {
  const handleColorChange = (color: CarColor, checked: boolean) => {
    if (checked) {
      handleColorFilterChange([...colorFilter, color]);
    } else {
      handleColorFilterChange(colorFilter.filter(c => c !== color));
    }
  };

  const handleTypeChange = (type: VehicleType, checked: boolean) => {
    if (checked) {
      handleTypeFilterChange([...typeFilter, type]);
    } else {
      handleTypeFilterChange(typeFilter.filter(t => t !== type));
    }
  };

  const handleServiceClassChange = (serviceClass: ServiceClass, checked: boolean) => {
    if (checked) {
      handleServiceClassFilterChange([...serviceClassFilter, serviceClass]);
    } else {
      handleServiceClassFilterChange(serviceClassFilter.filter(sc => sc !== serviceClass));
    }
  };

  const handleStatusChange = (status: VehicleStatus, checked: boolean) => {
    if (checked) {
      handleStatusFilterChange([...statusFilter, status]);
    } else {
      handleStatusFilterChange(statusFilter.filter(s => s !== status));
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setMakeFilter('');
    setModelFilter('');
    setYearFilter('');
    handleColorFilterChange([]);
    setLicensePlateFilter('');
    handleTypeFilterChange([]);
    handleServiceClassFilterChange([]);
    handleStatusFilterChange([]);
    setPassengerCapacityFilter('');
    handleFeaturesFilterChange([]);
  };

  const activeFiltersCount = [
    searchTerm,
    makeFilter,
    modelFilter,
    yearFilter,
    licensePlateFilter,
    passengerCapacityFilter,
  ].filter(Boolean).length +
  colorFilter.length +
  typeFilter.length +
  serviceClassFilter.length +
  statusFilter.length +
  featuresFilter.length;

  return (
    <>
      {/* Основные фильтры */}
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between overflow-x-auto py-2'>
        <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-4'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Поиск автомобилей...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 w-full md:w-80'
            />
          </div>

          <Select
            value={statusFilter.length === 1 ? statusFilter[0] : statusFilter.length > 1 ? 'multiple' : 'all'}
            onValueChange={(value) => {
              if (value === 'all') {
                handleStatusFilterChange([]);
              } else if (value !== 'multiple') {
                handleStatusFilterChange([value as VehicleStatus]);
              }
            }}
          >
            <SelectTrigger className='w-full md:w-40'>
              <SelectValue placeholder='Статус' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Все статусы</SelectItem>
              {Object.entries(statusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
              {statusFilter.length > 1 && (
                <SelectItem value='multiple' disabled>
                  Выбрано: {statusFilter.length}
                </SelectItem>
              )}
            </SelectContent>
          </Select>

          <Select value={pageSize.toString()} onValueChange={(value) => handlePageSizeChange(Number(value))}>
            <SelectTrigger className='w-full md:w-32'>
              <SelectValue placeholder='Размер' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='25'>25</SelectItem>
              <SelectItem value='50'>50</SelectItem>
              <SelectItem value='100'>100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-2 pr-4'>
          <div className='relative'>
            <Button
              variant={showAdvancedFilters ? 'default' : 'outline'}
              className='w-full md:w-auto'
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className='mr-2 h-4 w-4' />
              Фильтры
              {activeFiltersCount > 0 && (
                <Badge variant='secondary' className='ml-1'>
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {activeFiltersCount > 0 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={clearAllFilters}
                className='absolute -top-2 -right-2 h-5 w-5 p-0 bg-white border border-gray-300 rounded-full hover:scale-105 transition-transform'
              >
                <X className='h-3 w-3 text-red-500' />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Расширенные фильтры */}
      {showAdvancedFilters && (
        <div className='rounded-lg border bg-card p-4 space-y-2'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-medium'>Фильтры</h3>
            <div className='flex items-center gap-2'>
              {onSaveFilters && (
                <div className='flex items-center gap-3'>
                  {/* Текст-индикатор состояния */}
                  <span className={`text-sm font-medium ${
                    justSavedFilters ? 'text-green-600' :
                    hasSavedFilters ? 'text-blue-600' :
                    'text-gray-500'
                  }`}>
                    {justSavedFilters ? 'Сохранено!' : hasSavedFilters ? 'Запоминание Фильтров включено' : 'Запоминание фильтров отключено'}
                  </span>

                  {/* Кнопка действия */}
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={hasSavedFilters ? onClearSavedFilters : onSaveFilters}
                    title={hasSavedFilters ? 'Отключить автоматические фильтры' : 'Включить автоматическое применение фильтров'}
                    className={`h-8 w-8 p-0 transition-all duration-200 ${
                      hasSavedFilters ? 'text-red-500 hover:text-red-600 hover:bg-red-50' :
                      'text-blue-500 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {hasSavedFilters ? (
                      <X className='h-4 w-4' />
                    ) : (
                      <Save className='h-4 w-4' />
                    )}
                  </Button>
                </div>
              )}
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                  <Columns className='mr-2 h-4 w-4' />
                  Настроить колонки
                  <ChevronDown className='ml-2 h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start' className='w-48'>
                {[
                  { key: 'make', label: 'Марка' },
                  { key: 'model', label: 'Модель' },
                  { key: 'year', label: 'Год' },
                  { key: 'color', label: 'Цвет' },
                  { key: 'licensePlate', label: 'Номер' },
                  { key: 'type', label: 'Тип' },
                  { key: 'serviceClass', label: 'Класс' },
                  { key: 'status', label: 'Статус' },
                  { key: 'passengerCapacity', label: 'Места' },
                  { key: 'features', label: 'Опции' },
                ].map(column => (
                  <DropdownMenuItem
                    key={column.key}
                    className='flex items-center space-x-2 cursor-pointer'
                    onSelect={e => {
                      e.preventDefault();
                      handleColumnVisibilityChange(
                        column.key as keyof ColumnVisibility,
                        !columnVisibility[column.key as keyof ColumnVisibility],
                      );
                    }}
                  >
                    <Checkbox
                      checked={columnVisibility[column.key as keyof ColumnVisibility]}
                      className='pointer-events-none'
                    />
                    <span className='text-sm'>{column.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            <div>
              <Label htmlFor='make'>Марка</Label>
              <Input
                id='make'
                placeholder='Введите марку...'
                value={makeFilter}
                onChange={(e) => setMakeFilter(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor='model'>Модель</Label>
              <Input
                id='model'
                placeholder='Введите модель...'
                value={modelFilter}
                onChange={(e) => setModelFilter(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor='year'>Год выпуска</Label>
              <Input
                id='year'
                type='number'
                placeholder='Введите год...'
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor='licensePlate'>Гос. номер</Label>
              <Input
                id='licensePlate'
                placeholder='Введите номер...'
                value={licensePlateFilter}
                onChange={(e) => setLicensePlateFilter(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor='passengerCapacity'>Пассажировместимость</Label>
              <Input
                id='passengerCapacity'
                type='number'
                placeholder='Количество мест...'
                value={passengerCapacityFilter}
                onChange={(e) => setPassengerCapacityFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Фильтры с чекбоксами */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {/* Цвета */}
            <div>
              <Label className='text-sm font-medium'>Цвет</Label>
              <div className='mt-2 space-y-2 max-h-40 overflow-y-auto'>
                {Object.entries(colorLabels).map(([value, label]) => (
                  <div key={value} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`color-${value}`}
                      checked={colorFilter.includes(value as CarColor)}
                      onCheckedChange={(checked) => handleColorChange(value as CarColor, !!checked)}
                    />
                    <Label htmlFor={`color-${value}`} className='text-sm'>
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Типы */}
            <div>
              <Label className='text-sm font-medium'>Тип</Label>
              <div className='mt-2 space-y-2'>
                {Object.entries(typeLabels).map(([value, label]) => (
                  <div key={value} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`type-${value}`}
                      checked={typeFilter.includes(value as VehicleType)}
                      onCheckedChange={(checked) => handleTypeChange(value as VehicleType, !!checked)}
                    />
                    <Label htmlFor={`type-${value}`} className='text-sm'>
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Классы обслуживания */}
            <div>
              <Label className='text-sm font-medium'>Класс обслуживания</Label>
              <div className='mt-2 space-y-2'>
                {Object.entries(serviceClassLabels).map(([value, label]) => (
                  <div key={value} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`serviceClass-${value}`}
                      checked={serviceClassFilter.includes(value as ServiceClass)}
                      onCheckedChange={(checked) => handleServiceClassChange(value as ServiceClass, !!checked)}
                    />
                    <Label htmlFor={`serviceClass-${value}`} className='text-sm'>
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Статусы */}
            <div>
              <Label className='text-sm font-medium'>Статус</Label>
              <div className='mt-2 space-y-2'>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <div key={value} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`status-${value}`}
                      checked={statusFilter.includes(value as VehicleStatus)}
                      onCheckedChange={(checked) => handleStatusChange(value as VehicleStatus, !!checked)}
                    />
                    <Label htmlFor={`status-${value}`} className='text-sm'>
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>


        </div>
      )}
    </>
  );
}

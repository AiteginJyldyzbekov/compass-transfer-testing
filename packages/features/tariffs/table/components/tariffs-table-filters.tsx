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
import { CarType, CarTypeValues } from '@entities/tariffs/enums/CarType.enum';
import { type ServiceClass, ServiceClassValues } from '@entities/tariffs/enums/ServiceClass.enum';
import { getServiceClassLabel } from '@entities/users/utils/service-class-utils';

interface ColumnVisibility {
  name: boolean;
  serviceClass: boolean;
  carType: boolean;
  basePrice: boolean;
  minutePrice: boolean;
  minimumPrice: boolean;
  perKmPrice: boolean;
  freeWaitingTimeMinutes: boolean;
  archived: boolean;
  actions: boolean;
}

interface TariffsTableFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  nameFilter: string;
  setNameFilter: (name: string) => void;
  serviceClassFilter: ServiceClass[];
  handleServiceClassFilterChange: (classes: ServiceClass[]) => void;
  carTypeFilter: CarType[];
  handleCarTypeFilterChange: (types: CarType[]) => void;
  basePriceFromFilter: string;
  setBasePriceFromFilter: (price: string) => void;
  basePriceToFilter: string;
  setBasePriceToFilter: (price: string) => void;
  minutePriceFromFilter: string;
  setMinutePriceFromFilter: (price: string) => void;
  minutePriceToFilter: string;
  setMinutePriceToFilter: (price: string) => void;
  archivedFilter: boolean | null;
  setArchivedFilter: (archived: boolean | null) => void;
  handleArchivedFilterChange: (archived: boolean | null) => void;
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

// Переводы для типов автомобилей
const carTypeLabels: Record<CarType, string> = {
  [CarType.Sedan]: 'Седан',
  [CarType.Hatchback]: 'Хэтчбек',
  [CarType.SUV]: 'Внедорожник',
  [CarType.Minivan]: 'Минивэн',
  [CarType.Coupe]: 'Купе',
  [CarType.Cargo]: 'Грузовой',
  [CarType.Pickup]: 'Пикап',
};

export function TariffsTableFilters({
  searchTerm,
  setSearchTerm,
  nameFilter,
  setNameFilter,
  serviceClassFilter,
  handleServiceClassFilterChange,
  carTypeFilter,
  handleCarTypeFilterChange,
  basePriceFromFilter,
  setBasePriceFromFilter,
  basePriceToFilter,
  setBasePriceToFilter,
  minutePriceFromFilter,
  setMinutePriceFromFilter,
  minutePriceToFilter,
  setMinutePriceToFilter,
  archivedFilter,
  setArchivedFilter,
  handleArchivedFilterChange,
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
}: TariffsTableFiltersProps) {
  const handleServiceClassChange = (serviceClass: ServiceClass, checked: boolean) => {
    if (checked) {
      handleServiceClassFilterChange([...serviceClassFilter, serviceClass]);
    } else {
      handleServiceClassFilterChange(serviceClassFilter.filter(sc => sc !== serviceClass));
    }
  };

  const handleCarTypeChange = (carType: CarType, checked: boolean) => {
    if (checked) {
      handleCarTypeFilterChange([...carTypeFilter, carType]);
    } else {
      handleCarTypeFilterChange(carTypeFilter.filter(ct => ct !== carType));
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setNameFilter('');
    handleServiceClassFilterChange([]);
    handleCarTypeFilterChange([]);
    setBasePriceFromFilter('');
    setBasePriceToFilter('');
    setMinutePriceFromFilter('');
    setMinutePriceToFilter('');
    setArchivedFilter(null);
  };

  const activeFiltersCount = [
    searchTerm,
    nameFilter,
    basePriceFromFilter,
    basePriceToFilter,
    minutePriceFromFilter,
    minutePriceToFilter,
  ].filter(Boolean).length + 
  serviceClassFilter.length + 
  carTypeFilter.length +
  (archivedFilter !== null ? 1 : 0);

  return (
    <>
      {/* Основные фильтры */}
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between overflow-x-auto py-2'>
        <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-4'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Поиск тарифов...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 w-full md:w-80'
            />
          </div>

          <Select
            value={archivedFilter === null ? 'all' : archivedFilter.toString()}
            onValueChange={(value) => handleArchivedFilterChange(value === 'all' ? null : value === 'true')}
          >
            <SelectTrigger className='w-full md:w-40'>
              <SelectValue placeholder='Статус' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Все</SelectItem>
              <SelectItem value='false'>Активные</SelectItem>
              <SelectItem value='true'>Архивные</SelectItem>
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
                  { key: 'name', label: 'Название' },
                  { key: 'serviceClass', label: 'Класс' },
                  { key: 'carType', label: 'Тип авто' },
                  { key: 'basePrice', label: 'Базовая цена' },
                  { key: 'minutePrice', label: 'За минуту' },
                  { key: 'minimumPrice', label: 'Минимум' },
                  { key: 'perKmPrice', label: 'За км' },
                  { key: 'freeWaitingTimeMinutes', label: 'Ожидание' },
                  { key: 'archived', label: 'Статус' },
                  { key: 'actions', label: 'Действия' },
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
              <Label htmlFor='name'>Название тарифа</Label>
              <Input
                id='name'
                placeholder='Введите название...'
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor='basePriceFrom'>Базовая цена от (сом)</Label>
              <Input
                id='basePriceFrom'
                type='number'
                placeholder='Минимальная цена...'
                value={basePriceFromFilter}
                onChange={(e) => setBasePriceFromFilter(e.target.value)}
                min='0'
                step='0.01'
              />
            </div>

            <div>
              <Label htmlFor='basePriceTo'>Базовая цена до (сом)</Label>
              <Input
                id='basePriceTo'
                type='number'
                placeholder='Максимальная цена...'
                value={basePriceToFilter}
                onChange={(e) => setBasePriceToFilter(e.target.value)}
                min='0'
                step='0.01'
              />
            </div>


          </div>

          {/* Фильтры с чекбоксами */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* Классы обслуживания */}
            <div>
              <Label className='text-sm font-medium'>Класс обслуживания</Label>
              <div className='mt-2 space-y-2 max-h-40 overflow-y-auto'>
                {ServiceClassValues.map((serviceClass) => (
                  <div key={serviceClass} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`serviceClass-${serviceClass}`}
                      checked={serviceClassFilter.includes(serviceClass)}
                      onCheckedChange={(checked) => handleServiceClassChange(serviceClass, !!checked)}
                    />
                    <Label htmlFor={`serviceClass-${serviceClass}`} className='text-sm'>
                      {getServiceClassLabel(serviceClass)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Типы автомобилей */}
            <div>
              <Label className='text-sm font-medium'>Тип автомобиля</Label>
              <div className='mt-2 space-y-2 max-h-40 overflow-y-auto'>
                {CarTypeValues.map((carType) => (
                  <div key={carType} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`carType-${carType}`}
                      checked={carTypeFilter.includes(carType)}
                      onCheckedChange={(checked) => handleCarTypeChange(carType, !!checked)}
                    />
                    <Label htmlFor={`carType-${carType}`} className='text-sm'>
                      {carTypeLabels[carType]}
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

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

interface ColumnVisibility {
  name: boolean;
  description: boolean;
  price: boolean;
  isQuantifiable: boolean;
  actions: boolean;
}

interface ServicesTableFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  nameFilter: string;
  setNameFilter: (name: string) => void;
  priceFromFilter: string;
  setPriceFromFilter: (price: string) => void;
  priceToFilter: string;
  setPriceToFilter: (price: string) => void;
  isQuantifiableFilter: boolean | null;
  setIsQuantifiableFilter: (isQuantifiable: boolean | null) => void;
  handleIsQuantifiableFilterChange: (isQuantifiable: boolean | null) => void;
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

export function ServicesTableFilters({
  searchTerm,
  setSearchTerm,
  nameFilter,
  setNameFilter,
  priceFromFilter,
  setPriceFromFilter,
  priceToFilter,
  setPriceToFilter,
  isQuantifiableFilter,
  setIsQuantifiableFilter,
  handleIsQuantifiableFilterChange,
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
}: ServicesTableFiltersProps) {
  const clearAllFilters = () => {
    setSearchTerm('');
    setNameFilter('');
    setPriceFromFilter('');
    setPriceToFilter('');
    setIsQuantifiableFilter(null);
  };

  const activeFiltersCount = [
    searchTerm,
    nameFilter,
    priceFromFilter,
    priceToFilter,
  ].filter(Boolean).length + 
  (isQuantifiableFilter !== null ? 1 : 0);

  return (
    <>
      {/* Основные фильтры */}
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between overflow-x-auto py-2'>
        <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-4'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Поиск услуг...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 w-full md:w-80'
            />
          </div>

          <Select
            value={isQuantifiableFilter === null ? 'all' : isQuantifiableFilter.toString()}
            onValueChange={(value) => handleIsQuantifiableFilterChange(value === 'all' ? null : value === 'true')}
          >
            <SelectTrigger className='w-full md:w-40'>
              <SelectValue placeholder='Тип' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Все</SelectItem>
              <SelectItem value='true'>Количественная</SelectItem>
              <SelectItem value='false'>Фиксированная</SelectItem>
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
                  { key: 'description', label: 'Описание' },
                  { key: 'price', label: 'Цена' },
                  { key: 'isQuantifiable', label: 'Количественная' },
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
              <Label htmlFor='name'>Название услуги</Label>
              <Input
                id='name'
                placeholder='Введите название...'
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor='priceFrom'>Цена от (сом)</Label>
              <Input
                id='priceFrom'
                type='number'
                placeholder='Минимальная цена...'
                value={priceFromFilter}
                onChange={(e) => setPriceFromFilter(e.target.value)}
                min='0'
                step='0.01'
              />
            </div>

            <div>
              <Label htmlFor='priceTo'>Цена до (сом)</Label>
              <Input
                id='priceTo'
                type='number'
                placeholder='Максимальная цена...'
                value={priceToFilter}
                onChange={(e) => setPriceToFilter(e.target.value)}
                min='0'
                step='0.01'
              />
            </div>


          </div>
        </div>
      )}
    </>
  );
}

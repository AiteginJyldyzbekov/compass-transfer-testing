'use client';

import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';
import type { GetMyCarParams } from '@shared/api/cars';
import { Badge } from '@shared/ui/data-display/badge';
import { Button } from '@shared/ui/forms/button';
import { Input } from '@shared/ui/forms/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/forms/select';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
import { 
  CarColorValues, 
  VehicleTypeValues, 
  ServiceClassValues, 
  VehicleStatusValues 
} from '@entities/cars/enums';
import { 
  getCarColorLabel, 
  getVehicleTypeLabel, 
  getServiceClassLabel, 
  getVehicleStatusLabel 
} from '@entities/cars/lib/car-helpers';

interface CarsFiltersProps {
  onFiltersChange: (filters: GetMyCarParams) => void;
  currentFilters: GetMyCarParams;
}

export function CarsFilters({ onFiltersChange, currentFilters }: CarsFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<GetMyCarParams>(currentFilters);

  const handleFilterChange = (key: keyof GetMyCarParams, value: any) => {
    const newFilters = { ...localFilters, [key]: value };

    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { Size: currentFilters.Size || 10 };

    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.keys(localFilters).some(
    key => key !== 'Size' && localFilters[key as keyof GetMyCarParams]
  );

  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <Filter className='h-5 w-5' />
            Фильтры и поиск
          </CardTitle>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Скрыть' : 'Показать'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Поиск */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Поиск по марке, модели, номеру...'
            value={localFilters['FTS.Plain'] || ''}
            onChange={(e) => handleFilterChange('FTS.Plain', e.target.value)}
            className='pl-10'
          />
        </div>

        {isExpanded && (
          <div className='space-y-4'>
            {/* Основные фильтры */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Марка</label>
                <Input
                  placeholder='Например: Toyota'
                  value={localFilters.Make || ''}
                  onChange={(e) => handleFilterChange('Make', e.target.value)}
                />
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium'>Модель</label>
                <Input
                  placeholder='Например: Camry'
                  value={localFilters.Model || ''}
                  onChange={(e) => handleFilterChange('Model', e.target.value)}
                />
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium'>Год</label>
                <Input
                  type='number'
                  placeholder='2020'
                  value={localFilters.Year || ''}
                  onChange={(e) => handleFilterChange('Year', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium'>Номер</label>
                <Input
                  placeholder='01KG123ABC'
                  value={localFilters.LicensePlate || ''}
                  onChange={(e) => handleFilterChange('LicensePlate', e.target.value)}
                />
              </div>
            </div>

            {/* Селекты */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Цвет</label>
                <Select
                  value={localFilters.Color || ''}
                  onValueChange={(value) => handleFilterChange('Color', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Выберите цвет' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=''>Все цвета</SelectItem>
                    {CarColorValues.map((color) => (
                      <SelectItem key={color} value={color}>
                        {getCarColorLabel(color)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium'>Тип</label>
                <Select
                  value={localFilters.Type || ''}
                  onValueChange={(value) => handleFilterChange('Type', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Выберите тип' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=''>Все типы</SelectItem>
                    {VehicleTypeValues.map((type) => (
                      <SelectItem key={type} value={type}>
                        {getVehicleTypeLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium'>Класс</label>
                <Select
                  value={localFilters.ServiceClass || ''}
                  onValueChange={(value) => handleFilterChange('ServiceClass', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Выберите класс' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=''>Все классы</SelectItem>
                    {ServiceClassValues.map((serviceClass) => (
                      <SelectItem key={serviceClass} value={serviceClass}>
                        {getServiceClassLabel(serviceClass)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium'>Статус</label>
                <Select
                  value={localFilters.Status || ''}
                  onValueChange={(value) => handleFilterChange('Status', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Выберите статус' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=''>Все статусы</SelectItem>
                    {VehicleStatusValues.map((status) => (
                      <SelectItem key={status} value={status}>
                        {getVehicleStatusLabel(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className='flex gap-2'>
              <Button onClick={applyFilters}>
                Применить фильтры
              </Button>
              {hasActiveFilters && (
                <Button variant='outline' onClick={clearFilters}>
                  <X className='h-4 w-4 mr-2' />
                  Очистить
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Активные фильтры */}
        {hasActiveFilters && (
          <div className='flex flex-wrap gap-2'>
            {Object.entries(localFilters).map(([key, value]) => {
              if (!value || key === 'Size') return null;
              
              return (
                <Badge key={key} variant='secondary' className='gap-1'>
                  {key}: {String(value)}
                  <X 
                    className='h-3 w-3 cursor-pointer' 
                    onClick={() => handleFilterChange(key as keyof GetMyCarParams, undefined)}
                  />
                </Badge>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

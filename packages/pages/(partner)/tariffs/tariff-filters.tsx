'use client';

import { Search, Filter, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@shared/ui/forms/button';
import { Input } from '@shared/ui/forms/input';
import { Badge } from '@shared/ui/data-display/badge';
import { Card, CardContent } from '@shared/ui/layout/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@shared/ui/forms/select';
import { CarTypeValues } from '@entities/tariffs/enums/CarType.enum';
import { ServiceClassValues } from '@entities/tariffs/enums/ServiceClass.enum';

interface TariffFiltersProps {
  onFiltersChange?: (filters: {
    name?: string;
    serviceClass?: string;
    carType?: string;
  }) => void;
}

export function TariffFilters({ onFiltersChange }: TariffFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [name, setName] = useState(searchParams.get('name') || '');
  const [serviceClass, setServiceClass] = useState(searchParams.get('serviceClass') || '');
  const [carType, setCarType] = useState(searchParams.get('carType') || '');
  const [isExpanded, setIsExpanded] = useState(false);

  // Обновляем URL при изменении фильтров
  useEffect(() => {
    const params = new URLSearchParams();

    if (name) params.set('name', name);
    if (serviceClass) params.set('serviceClass', serviceClass);
    if (carType) params.set('carType', carType);

    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.replace(`/tariffs${newUrl}`, { scroll: false });
  }, [name, serviceClass, carType, router]);

  // Отдельный useEffect для вызова колбэка
  useEffect(() => {
    // Не вызываем колбэк при первом рендере с пустыми значениями
    if (onFiltersChange && (name || serviceClass || carType)) {
      onFiltersChange({
        name: name || undefined,
        serviceClass: serviceClass || undefined,
        carType: carType || undefined,
      });
    }
  }, [name, serviceClass, carType]); // Убираем onFiltersChange из зависимостей

  const clearFilters = () => {
    setName('');
    setServiceClass('');
    setCarType('');
  };

  const hasActiveFilters = name || serviceClass || carType;
  const activeFiltersCount = [name, serviceClass, carType].filter(Boolean).length;

  return (
    <Card className='mb-6'>
      <CardContent className='p-4'>
        {/* Основная строка поиска */}
        <div className='flex items-center gap-4 mb-4'>
          <div className='flex-1 relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Поиск тарифов по названию...'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='pl-10'
            />
          </div>
          
          <Button
            variant='outline'
            onClick={() => setIsExpanded(!isExpanded)}
            className='flex items-center gap-2'
          >
            <Filter className='h-4 w-4' />
            Фильтры
            {activeFiltersCount > 0 && (
              <Badge variant='secondary' className='ml-1'>
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant='ghost'
              size='sm'
              onClick={clearFilters}
              className='flex items-center gap-2 text-muted-foreground hover:text-foreground'
            >
              <X className='h-4 w-4' />
              Очистить
            </Button>
          )}
        </div>

        {/* Расширенные фильтры */}
        {isExpanded && (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Класс обслуживания</label>
              <Select value={serviceClass} onValueChange={setServiceClass}>
                <SelectTrigger>
                  <SelectValue placeholder='Выберите класс' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=''>Все классы</SelectItem>
                  {Object.entries(ServiceClassValues).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium'>Тип автомобиля</label>
              <Select value={carType} onValueChange={setCarType}>
                <SelectTrigger>
                  <SelectValue placeholder='Выберите тип' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=''>Все типы</SelectItem>
                  {Object.entries(CarTypeValues).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Активные фильтры */}
        {hasActiveFilters && (
          <div className='flex flex-wrap gap-2 mt-4 pt-4 border-t'>
            <span className='text-sm text-muted-foreground'>Активные фильтры:</span>
            
            {name && (
              <Badge variant='secondary' className='flex items-center gap-1'>
                Поиск: {name}
                <X 
                  className='h-3 w-3 cursor-pointer hover:text-destructive' 
                  onClick={() => setName('')}
                />
              </Badge>
            )}
            
            {serviceClass && (
              <Badge variant='secondary' className='flex items-center gap-1'>
                {ServiceClassValues[serviceClass as keyof typeof ServiceClassValues]}
                <X 
                  className='h-3 w-3 cursor-pointer hover:text-destructive' 
                  onClick={() => setServiceClass('')}
                />
              </Badge>
            )}
            
            {carType && (
              <Badge variant='secondary' className='flex items-center gap-1'>
                {CarTypeValues[carType as keyof typeof CarTypeValues]}
                <X 
                  className='h-3 w-3 cursor-pointer hover:text-destructive' 
                  onClick={() => setCarType('')}
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

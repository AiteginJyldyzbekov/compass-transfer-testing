'use client';

import { Search, MapPin, Loader2, X, Info } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { locationsApi } from '@shared/api/locations';
import { useDebounce } from '@shared/hooks';
import { logger } from '@shared/lib';
import { Card, CardContent } from '@shared/ui/layout/card';
import { LocationSheet } from '@shared/ui/modals/location-sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/modals/tooltip';
import type { Location } from '@entities/user';
import { Button } from './button';
import { Input } from './input';

interface LocationSelectProps {
  value?: string | null;
  onValueChange: (locationId: string | null) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export function LocationSelect({
  value,
  onValueChange,
  placeholder = 'Выберите локацию',
  className = '',
  error = false,
}: LocationSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [sheetLocationId, setSheetLocationId] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Загрузка популярных локаций при открытии
  useEffect(() => {
    if (isOpen && locations.length === 0) {
      loadPopularLocations();
    }
  }, [isOpen, locations.length]);

  // Поиск локаций при изменении запроса
  useEffect(() => {
    if (debouncedSearch.trim()) {
      searchLocations(debouncedSearch);
    } else if (isOpen) {
      loadPopularLocations();
    }
  }, [debouncedSearch, isOpen]);

  // Загрузка выбранной локации при изменении value
  useEffect(() => {
    if (value && !selectedLocation) {
      loadSelectedLocation(value);
    }
  }, [value, selectedLocation]);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadPopularLocations = async () => {
    setIsLoading(true);
    try {
      const popularLocations = await locationsApi.getPopularLocations(10);

      setLocations(popularLocations);
    } catch (error) {
      logger.error('Ошибка загрузки популярных локаций:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchLocations = async (query: string) => {
    setIsLoading(true);
    try {
      const searchResults = await locationsApi.searchLocations(query, 10);

      setLocations(searchResults);
    } catch (error) {
      logger.error('Ошибка поиска локаций:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSelectedLocation = async (locationId: string) => {
    try {
      const location = await locationsApi.getLocationById(locationId);

      setSelectedLocation(location);
    } catch (error) {
      logger.error('Ошибка загрузки выбранной локации:', error);
    }
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    onValueChange(location.id);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    setSelectedLocation(null);
    onValueChange(null);
    setSearchQuery('');
  };

  const handleOpenSheet = (locationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSheetLocationId(locationId);
    setIsSheetOpen(true);
  };

  const getLocationDisplayText = (location: Location) => {
    return `${location.name}${location.district ? `, ${location.district}` : ''}, ${location.city}`;
  };

  const getLocationTooltipContent = (location: Location) => {
    return (
      <div className='space-y-1'>
        <div className='font-medium'>{location.name}</div>
        <div className='text-xs text-muted-foreground'>{location.address}</div>
        <div className='text-xs text-muted-foreground'>
          {location.district && `${location.district}, `}
          {location.city}, {location.region}
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div ref={containerRef} className={`relative ${className}`}>
        {/* Поле ввода */}
        <div className='relative'>
          <Input
            value={selectedLocation ? getLocationDisplayText(selectedLocation) : searchQuery}
            onChange={e => {
              if (!selectedLocation) {
                setSearchQuery(e.target.value);
              }
            }}
            onFocus={() => {
              if (!selectedLocation) {
                setIsOpen(true);
              }
            }}
            placeholder={placeholder}
            className={`pr-10 focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
              error ? 'border-red-500' : ''
            }`}
            readOnly={!!selectedLocation}
          />
          <div className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1'>
            {isLoading && <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />}
            {selectedLocation ? (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={handleClear}
                className='h-6 w-6 p-0 hover:bg-muted'
              >
                <X className='h-3 w-3' />
              </Button>
            ) : (
              <Search className='h-4 w-4 text-muted-foreground' />
            )}
          </div>
        </div>

        {/* Выпадающий список */}
        {isOpen && (
          <Card className='absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-hidden'>
            <CardContent className='p-0'>
              {/* Поиск */}
              {!selectedLocation && (
                <div className='p-3 border-b'>
                  <Input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder='Поиск локаций...'
                    className='focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0'
                  />
                </div>
              )}

              {/* Список локаций */}
              <div className='max-h-48 overflow-y-auto'>
                {isLoading ? (
                  <div className='flex items-center justify-center p-4'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    <span className='ml-2 text-sm text-muted-foreground'>Поиск...</span>
                  </div>
                ) : locations.length > 0 ? (
                  locations.map(location => (
                    <div
                      key={location.id}
                      className='flex items-center justify-between p-3 hover:bg-muted focus:bg-muted focus:outline-none transition-colors cursor-pointer'
                      onClick={() => handleLocationSelect(location)}
                    >
                      <div className='flex items-start space-x-2 flex-1 min-w-0'>
                        <MapPin className='h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0' />
                        <div className='flex-1 min-w-0'>
                          <div className='font-medium text-sm truncate'>{location.name}</div>
                          <div className='text-xs text-muted-foreground truncate'>
                            {location.address}
                            {location.district && `, ${location.district}`}
                            {`, ${location.city}`}
                          </div>
                        </div>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            onClick={e => handleOpenSheet(location.id, e)}
                            className='h-6 w-6 p-0 hover:bg-background ml-2 flex-shrink-0'
                          >
                            <Info className='h-3 w-3' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side='left' className='max-w-xs'>
                          {getLocationTooltipContent(location)}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  ))
                ) : (
                  <div className='p-4 text-center text-sm text-muted-foreground'>
                    {searchQuery ? 'Локации не найдены' : 'Нет доступных локаций'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location Sheet */}
        <LocationSheet
          locationId={sheetLocationId}
          isOpen={isSheetOpen}
          onClose={() => {
            setIsSheetOpen(false);
            setSheetLocationId(null);
          }}
        />
      </div>
    </TooltipProvider>
  );
}

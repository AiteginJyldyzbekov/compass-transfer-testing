'use client';

import { Search, MapPin, Filter, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Badge } from '@shared/ui/data-display/badge';
import { Button } from '@shared/ui/forms/button';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/forms/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/layout/dialog';
import { LocationType, LocationTypeLabels, locationTypeIcons } from '@entities/locations/enums/LocationType.enum';
import { getCities, getRegionsByCity } from '@entities/locations/helpers';
import type { GetLocationDTO } from '@entities/locations/interface';
import { useLocations } from '@features/locations/hooks/useLocations';

interface LocationSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: GetLocationDTO) => void;
  title: string;
  selectedLocationIds?: string[]; // Уже выбранные локации
}

interface Filters {
  type?: LocationType;
  city?: string;
  region?: string;
  isActive?: boolean;
}

export function LocationSelectionModal({
  isOpen,
  onClose,
  onLocationSelect,
  title,
  selectedLocationIds = []
}: LocationSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<GetLocationDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { searchLocations } = useLocations();

  // Получаем списки городов и регионов
  const cities = getCities();
  const availableRegions = filters.city ? getRegionsByCity(filters.city) : [];

  // Поиск локаций с фильтрами
  useEffect(() => {
    const performSearch = async () => {
      if (!isOpen) return;

      setIsSearching(true);
      try {
        const params: Record<string, string | number | boolean | LocationType[]> = {
          First: true,
          Size: 100,
        };

        // Поиск по названию или адресу
        if (searchQuery.trim()) {
          params.Name = searchQuery.trim();
          params.NameOp = 'Contains';
        }

        // Фильтры
        if (filters.type) {
          params.Type = [filters.type];
        }
        if (filters.city) {
          params.City = filters.city;
          params.CityOp = 'Contains';
        }
        if (filters.region) {
          params.Region = filters.region;
          params.RegionOp = 'Contains';
        }
        if (filters.isActive !== undefined) {
          params.IsActive = filters.isActive;
        }

        const results = await searchLocations(searchQuery, undefined, params);
        
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters, isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Сброс при закрытии
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setFilters({});
      setSearchResults([]);
      setShowFilters(false);
    }
  }, [isOpen]);

  const handleLocationClick = (location: GetLocationDTO) => {
    onLocationSelect(location);
    onClose();
  };

  const clearFilters = () => {
    setFilters({});
  };

  const handleCityChange = (city: string) => {
    setFilters(prev => ({
      ...prev,
      city: city === 'all' ? undefined : city,
      region: undefined // Сбрасываем регион при изменении города
    }));
  };

  const handleRegionChange = (region: string) => {
    setFilters(prev => ({
      ...prev,
      region: region === 'all' ? undefined : region
    }));
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] w-[90vw] overflow-hidden flex flex-col z-[1000]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {title}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Поиск */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по названию..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Фильтры
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1">
                    {Object.values(filters).filter(v => v !== undefined && v !== '').length}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Фильтры */}
            {showFilters && (
              <div className="border rounded-lg p-4 space-y-4 bg-muted/50">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Фильтры</h4>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Очистить
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Тип локации</Label>
                    <Select
                      value={filters.type || 'all'}
                      onValueChange={(value) => setFilters(prev => ({
                        ...prev,
                        type: value === 'all' ? undefined : value as LocationType
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Все типы" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все типы</SelectItem>
                        {Object.values(LocationType).map(type => (
                          <SelectItem key={type} value={type}>
                            <span className="flex items-center gap-2">
                              <span>{locationTypeIcons[type]}</span>
                              {LocationTypeLabels[type]}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Город</Label>
                    <Select
                      value={filters.city || 'all'}
                      onValueChange={handleCityChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите город" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все города</SelectItem>
                        {cities.map(city => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Регион</Label>
                    <Select
                      value={filters.region || 'all'}
                      onValueChange={handleRegionChange}
                      disabled={!filters.city}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={
                          filters.city ? "Выберите регион" : "Сначала выберите город"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все регионы</SelectItem>
                        {availableRegions.map(region => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Результаты */}
          <div className="flex-1 overflow-auto">
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Поиск локаций...</p>
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-3">
                  Найдено локаций: {searchResults.length}
                </p>
                {searchResults.map((location) => {
                  const isAlreadySelected = selectedLocationIds.includes(location.id);

                  return (
                    <div
                      key={location.id}
                      className={`border rounded-lg p-3 transition-colors ${
                        isAlreadySelected
                          ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60'
                          : 'cursor-pointer hover:bg-muted/50'
                      }`}
                      onClick={() => !isAlreadySelected && handleLocationClick(location)}
                    >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium flex items-center gap-2">
                          <span>{locationTypeIcons[location.type]}</span>
                          {location.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">{location.address}</p>
                        <p className="text-xs text-muted-foreground">
                          {location.city}, {location.region}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline">{LocationTypeLabels[location.type]}</Badge>
                      </div>
                    </div>
                    {isAlreadySelected && (
                      <div className="mt-2 text-xs text-gray-500 italic">
                        Уже выбрано в маршруте
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    {searchQuery || hasActiveFilters 
                      ? 'Локации не найдены' 
                      : 'Введите запрос для поиска локаций'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

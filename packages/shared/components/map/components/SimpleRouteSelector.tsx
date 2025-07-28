'use client';

import React from 'react';
import { Clock, MapPin, Zap, Leaf } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/forms/select';
import type { RouteResult, RouteType } from '../types';

interface SimpleRouteSelectorProps {
  routes: RouteResult[];
  selectedRouteType: RouteType | null;
  onRouteSelect: (routeType: RouteType) => void;
  isLoading?: boolean;
}

const getRouteIcon = (routeType: RouteType) => {
  switch (routeType) {
    case 'fastest':
      return <Zap className="h-4 w-4" />;
    case 'shortest':
      return <MapPin className="h-4 w-4" />;
    case 'short_fastest':
      return <Clock className="h-4 w-4" />;
    case 'eco':
      return <Leaf className="h-4 w-4" />;
    default:
      return <MapPin className="h-4 w-4" />;
  }
};

const formatDistance = (distance: number): string => {
  if (distance >= 1000) {
    return `${(distance / 1000).toFixed(1)} км`;
  }
  return `${Math.round(distance)} м`;
};

const formatDuration = (duration: number): string => {
  const minutes = Math.round(duration / 60);
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}ч ${remainingMinutes}м`;
  }
  return `${minutes} мин`;
};

export const SimpleRouteSelector: React.FC<SimpleRouteSelectorProps> = ({
  routes,
  selectedRouteType,
  onRouteSelect,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
        <span className="text-sm text-muted-foreground">Построение маршрутов...</span>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-muted-foreground text-center">Маршруты не найдены</p>
      </div>
    );
  }

  const selectedRoute = routes.find(route => route.type === selectedRouteType);

  return (
    <div className="space-y-2">
      <Select
        value={selectedRouteType || ''}
        onValueChange={(value) => onRouteSelect(value as RouteType)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Выберите тип маршрута">
            {selectedRoute && (
              <div className="flex items-center gap-2">
                <div 
                  className="p-1 rounded"
                  style={{ 
                    backgroundColor: `${selectedRoute.info.color}20`, 
                    color: selectedRoute.info.color 
                  }}
                >
                  {getRouteIcon(selectedRoute.type)}
                </div>
                <span>{selectedRoute.info.name}</span>
                {selectedRoute.distance > 0 && (
                  <span className="text-muted-foreground text-xs">
                    • {formatDistance(selectedRoute.distance)}
                  </span>
                )}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {routes.map((route) => (
            <SelectItem key={route.type} value={route.type}>
              <div className="flex items-center gap-2 w-full">
                <div 
                  className="p-1 rounded"
                  style={{ 
                    backgroundColor: `${route.info.color}20`, 
                    color: route.info.color 
                  }}
                >
                  {getRouteIcon(route.type)}
                </div>
                <div className="flex-1">
                  <span className="font-medium">{route.info.name}</span>
                  <div className="text-xs text-muted-foreground flex gap-2">
                    {route.distance > 0 && <span>{formatDistance(route.distance)}</span>}
                    {route.duration > 0 && <span>{formatDuration(route.duration)}</span>}
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

'use client';

import { createContext, useContext } from 'react';
import type { GetLocationDTO } from '@entities/locations/interface';

export interface MapBounds {
  latFrom: number;
  latTo: number;
  longFrom: number;
  longTo: number;
}

export interface MapBoundsContextType {
  // === КАРТА И ГРАНИЦЫ ===
  mapBounds: MapBounds | null;
  setMapBounds: (bounds: MapBounds) => void;
  
  // === ЛОКАЦИИ ДЛЯ КАРТЫ (по границам) ===
  mapLocations: GetLocationDTO[];
  isMapLoading: boolean;
  mapError: string | null;
  
  // === ВЫБРАННЫЕ ЛОКАЦИИ (синхронизация между картой и селектором) ===
  selectedLocations: GetLocationDTO[];
  addLocation: (location: GetLocationDTO) => void;
  removeLocation: (locationId: string) => void;
  clearLocations: () => void;
  setSelectedLocations: (locations: GetLocationDTO[]) => void;
}

export const MapBoundsContext = createContext<MapBoundsContextType | null>(null);

export const useMapBounds = () => {
  const context = useContext(MapBoundsContext);

  if (!context) {
    throw new Error('useMapBounds must be used within MapBoundsProvider');
  }

  return context;
}; 
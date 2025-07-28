'use client';

import { useState, useCallback } from 'react';

interface MapSheetData {
  address: string;
  latitude?: number;
  longitude?: number;
  title?: string;
}

interface UseMapSheetReturn {
  isOpen: boolean;
  mapData: MapSheetData | null;
  openMapSheet: (data: MapSheetData) => void;
  closeMapSheet: () => void;
}

export function useMapSheet(): UseMapSheetReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [mapData, setMapData] = useState<MapSheetData | null>(null);

  const openMapSheet = useCallback((data: MapSheetData) => {
    setMapData(data);
    setIsOpen(true);
  }, []);

  const closeMapSheet = useCallback(() => {
    setIsOpen(false);
    // Задержка для анимации закрытия
    setTimeout(() => {
      setMapData(null);
    }, 300);
  }, []);

  return {
    isOpen,
    mapData,
    openMapSheet,
    closeMapSheet,
  };
}

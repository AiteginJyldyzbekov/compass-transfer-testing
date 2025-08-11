'use client';

import type React from 'react';
import { useMapEvents } from 'react-leaflet';

interface MapClickHandlerProps {
  onMapClick?: (lat: number, lng: number) => void;
}

/**
 * Компонент для обработки кликов по карте
 */
export const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onMapClick }) => {
  useMapEvents({
    click: e => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return null;
};

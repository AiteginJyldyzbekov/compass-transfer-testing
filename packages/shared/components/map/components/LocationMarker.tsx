'use client';

import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import type L from 'leaflet';
import type { GetLocationDTO } from '@entities/locations/interface';

interface LocationMarkerProps {
  location: GetLocationDTO;
  icon: L.DivIcon;
  isSelected?: boolean;
  onLocationToggle?: (location: GetLocationDTO, isSelected: boolean) => void;
}

/**
 * Компонент маркера локации с popup
 */
export const LocationMarker: React.FC<LocationMarkerProps> = ({
  location,
  icon,
  isSelected = false,
  onLocationToggle,
}) => {
  if (!location.latitude || !location.longitude) {
    return null;
  }

  return (
    <Marker
      key={`loc-${location.id}`}
      position={[location.latitude, location.longitude]}
      icon={icon}
    >
      <Popup>
        <div style={{ minWidth: '12.5rem' }}>
          <div style={{ marginBottom: '0.5rem', fontWeight: 600 }}>{location.name}</div>
          <div style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>
            <div>
              <strong>Координаты:</strong> {location.latitude.toFixed(6)},{' '}
              {location.longitude.toFixed(6)}
            </div>
          </div>
          {onLocationToggle && (
            <button
              type='button'
              onClick={() => {
                onLocationToggle(location, !isSelected);
              }}
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                backgroundColor: isSelected ? '#ef4444' : '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = isSelected ? '#dc2626' : '#16a34a';
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = isSelected ? '#ef4444' : '#22c55e';
              }}
            >
              {isSelected ? '❌ Убрать' : '✅ Выбрать'}
            </button>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

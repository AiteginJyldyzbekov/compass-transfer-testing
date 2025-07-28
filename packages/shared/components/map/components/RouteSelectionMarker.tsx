'use client';

import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import type { RouteLocation } from '../types';
import { createPinIcon } from '../icons';

interface RouteSelectionMarkerProps {
  location: RouteLocation;
  selectedStartLocation?: RouteLocation | null;
  selectedEndLocation?: RouteLocation | null;
  onLocationSelect?: (location: RouteLocation) => void;
  isSelectingStart?: boolean;
  uiScale?: number;
}

/**
 * Компонент маркера локации для выбора маршрута
 */
export const RouteSelectionMarker: React.FC<RouteSelectionMarkerProps> = ({
  location,
  selectedStartLocation,
  selectedEndLocation,
  onLocationSelect,
  isSelectingStart = true,
  uiScale = 1,
}) => {
  const isStartLocation = selectedStartLocation?.id === location.id;
  const isEndLocation = selectedEndLocation?.id === location.id;
  const isSelected = isStartLocation || isEndLocation;

  let color = '#6b7280'; // серый по умолчанию

  if (isStartLocation) color = '#22c55e'; // зеленый для начальной точки
  if (isEndLocation) color = '#ef4444'; // красный для конечной точки

  const icon = createPinIcon(color, undefined, uiScale);

  return (
    <Marker
      key={`route-loc-${location.id}`}
      position={[location.latitude, location.longitude]}
      icon={icon}
      eventHandlers={{
        click: () => {
          if (onLocationSelect) {
            onLocationSelect(location);
          }
        },
      }}
    >
      <Popup>
        <div style={{ minWidth: '12.5rem' }}>
          <div style={{ marginBottom: '0.5rem', fontWeight: 600 }}>{location.name}</div>
          <div style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>
            <div>
              <strong>Тип:</strong> {location.type}
            </div>
            <div>
              <strong>Координаты:</strong> {location.latitude.toFixed(6)},{' '}
              {location.longitude.toFixed(6)}
            </div>
          </div>
          {onLocationSelect && (
            <button
              type='button'
              onClick={() => onLocationSelect(location)}
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                backgroundColor: isSelected
                  ? isStartLocation
                    ? '#22c55e'
                    : '#ef4444'
                  : isSelectingStart
                    ? '#22c55e'
                    : '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              {isSelected
                ? isStartLocation
                  ? '🟢 Начальная точка'
                  : '🔴 Конечная точка'
                : isSelectingStart
                  ? '🟢 Выбрать как начальную'
                  : '🔴 Выбрать как конечную'}
            </button>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

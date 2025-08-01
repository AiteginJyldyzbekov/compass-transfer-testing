'use client';

import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import type L from 'leaflet';
import type { GetLocationDTO } from '@entities/locations/interface';

interface LocationMarkerProps {
  location: GetLocationDTO;
  icon: L.DivIcon;
  isSelected?: boolean;
  canSelect?: boolean;
  onLocationToggle?: (location: GetLocationDTO, isSelected: boolean) => void;
}

/**
 * Компонент маркера локации с popup
 */
export const LocationMarker: React.FC<LocationMarkerProps> = ({
  location,
  icon,
  isSelected = false,
  canSelect = true,
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
        <div style={{ minWidth: '15rem', maxWidth: '20rem' }}>
          {/* Название */}
          <div style={{ marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
            {location.name}
          </div>

          {/* Адрес */}
          {location.address && (
            <div style={{ fontSize: '0.75rem', marginBottom: '0.5rem', color: '#6b7280' }}>
              <strong>Адрес:</strong> {location.address}
            </div>
          )}



          {/* Кнопки действий */}
          {onLocationToggle && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {isSelected ? (
                // Если локация уже выбрана - показываем только кнопку отмены
                <button
                  type='button'
                  onClick={() => {
                    onLocationToggle(location, false);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.backgroundColor = '#ef4444';
                  }}
                >
                  ❌ Отменить точку
                </button>
              ) : canSelect ? (
                // Если локация не выбрана и можно выбрать - показываем кнопку выбора
                <button
                  type='button'
                  onClick={() => {
                    onLocationToggle(location, true);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: '#22c55e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.backgroundColor = '#16a34a';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.backgroundColor = '#22c55e';
                  }}
                >
                  ✅ Выбрать точку
                </button>
              ) : (
                // Если нельзя выбрать - показываем информационное сообщение
                <div style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem',
                  textAlign: 'center',
                }}>
                  Все точки маршрута заняты
                </div>
              )}
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

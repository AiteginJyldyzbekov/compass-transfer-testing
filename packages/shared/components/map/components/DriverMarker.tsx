'use client';

import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import type { ActiveDriverDTO } from '../types';
import { createDriverIcon } from '../icons';

interface DriverMarkerProps {
  driver: ActiveDriverDTO;
  isSelected?: boolean;
  heading?: number;
  onDriverSelect?: (driver: ActiveDriverDTO | string) => void;
  getDriverById?: (id: string) => Record<string, unknown> | null;
  uiScale?: number;
}

/**
 * Компонент маркера водителя с popup
 */
export const DriverMarker: React.FC<DriverMarkerProps> = ({
  driver,
  isSelected = false,
  heading = 0,
  onDriverSelect,
  getDriverById,
  uiScale = 1,
}) => {
  const fullDriverData = getDriverById?.(driver.id);

  return (
    <Marker
      key={`driver-${driver.id}`}
      position={[driver.currentLocation.latitude, driver.currentLocation.longitude]}
      icon={createDriverIcon(driver.serviceClass, isSelected, heading, uiScale)}
    >
      <Popup>
        <div style={{ minWidth: '15.625rem' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <strong style={{ fontSize: '0.875rem' }}>
              {(fullDriverData?.fullName as string) || 'Активный водитель'}
            </strong>
            {isSelected && (
              <span
                style={{
                  marginLeft: '0.5rem',
                  fontSize: '0.625rem',
                  backgroundColor: '#22c55e',
                  color: 'white',
                  padding: '0.125rem 0.375rem',
                  borderRadius: '0.25rem',
                  fontWeight: 'bold',
                }}
              >
                ✓ ВЫБРАН
              </span>
            )}
          </div>

          {/* Информация о водителе */}
          {fullDriverData && (
            <div style={{ fontSize: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ marginBottom: '0.375rem' }}>
                <strong>📞 Телефон:</strong>{' '}
                {String(fullDriverData.phoneNumber || 'Не указан')}
              </div>
              <div style={{ marginBottom: '0.375rem' }}>
                <strong>⭐ Рейтинг:</strong>{' '}
                {typeof fullDriverData.rating === 'number'
                  ? `${fullDriverData.rating}/5`
                  : 'Нет рейтинга'}
              </div>
              <div style={{ marginBottom: '0.375rem' }}>
                <strong>🟢 Статус:</strong> {fullDriverData.online ? 'Онлайн' : 'Оффлайн'}
              </div>
            </div>
          )}

          {/* Информация об автомобиле */}
          <div style={{ fontSize: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ marginBottom: '0.375rem' }}>
              <strong>🚗 Автомобиль:</strong>{' '}
              {String(
                (fullDriverData?.activeCar as Record<string, unknown>)?.make ||
                  'Неизвестно',
              )}{' '}
              {String(
                (fullDriverData?.activeCar as Record<string, unknown>)?.model ||
                  driver.type,
              )}
            </div>
            {(() => {
              const licensePlate =
                fullDriverData &&
                (fullDriverData.activeCar as Record<string, unknown>)?.licensePlate;

              return licensePlate ? (
                <div style={{ marginBottom: '0.375rem' }}>
                  <strong>🔢 Номер:</strong>
                  <span
                    style={{
                      marginLeft: '0.25rem',
                      backgroundColor: '#f3f4f6',
                      padding: '0.125rem 0.375rem',
                      borderRadius: '0.25rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {String(licensePlate)}
                  </span>
                </div>
              ) : null;
            })()}
            <div style={{ marginBottom: '0.375rem' }}>
              <strong>🎯 Класс:</strong> {driver.serviceClass}
            </div>
            {(() => {
              const color =
                fullDriverData &&
                (fullDriverData.activeCar as Record<string, unknown>)?.color;

              return color ? (
                <div style={{ marginBottom: '0.375rem' }}>
                  <strong>🎨 Цвет:</strong> {String(color)}
                </div>
              ) : null;
            })()}
            {(() => {
              const capacity =
                fullDriverData &&
                (fullDriverData.activeCar as Record<string, unknown>)?.passengerCapacity;

              return capacity ? (
                <div style={{ marginBottom: '0.375rem' }}>
                  <strong>👥 Мест:</strong> {String(capacity)}
                </div>
              ) : null;
            })()}
          </div>

          <div style={{ fontSize: '0.625rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            <strong>📍 Координаты:</strong> {driver.currentLocation.latitude.toFixed(6)},{' '}
            {driver.currentLocation.longitude.toFixed(6)}
          </div>

          {onDriverSelect && (
            <button
              type='button'
              onClick={() => {
                if (isSelected) {
                  onDriverSelect('');
                } else {
                  onDriverSelect(driver);
                }
              }}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                backgroundColor: isSelected ? '#ef4444' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = isSelected
                  ? '#dc2626'
                  : '#2563eb';
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = isSelected
                  ? '#ef4444'
                  : '#3b82f6';
              }}
            >
              {isSelected ? '❌ Отписаться' : '✅ Выбрать водителя'}
            </button>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

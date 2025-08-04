'use client';

import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import React, { useRef, useCallback, useLayoutEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { CarTypeValues, type CarType } from '@entities/tariffs/enums/CarType.enum';
import { ServiceClassValues, type ServiceClass } from '@entities/tariffs/enums/ServiceClass.enum';
import { createDriverIcon } from '../icons';
import type { ActiveDriverDTO } from '../types';

interface DriverMarkerProps {
  driver: ActiveDriverDTO;
  isSelected?: boolean;
  heading?: number;
  onDriverSelect?: (driver: ActiveDriverDTO | string) => void;
  getDriverById?: (id: string) => Record<string, unknown> | null;
  loadDriverData?: (id: string) => Promise<void>;
  uiScale?: number;
  forceOpenPopup?: boolean;
  userRole?: 'admin' | 'operator' | 'partner' | 'driver';
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
  loadDriverData,
  uiScale = 1,
  forceOpenPopup = false,
  userRole = 'operator',
}) => {
  const fullDriverData = getDriverById?.(driver.id);
  const popupRef = useRef<L.Popup>(null);
  const markerRef = useRef<L.Marker>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Обработчик клика по маркеру - загружаем данные водителя
  const handleMarkerClick = useCallback(async () => {
    if (loadDriverData && !fullDriverData) {
      setIsLoadingData(true);
      try {
        await loadDriverData(driver.id);
      } finally {
        setIsLoadingData(false);
      }
    }
  }, [loadDriverData, driver.id, fullDriverData]);

  // Устанавливаем driverId в опции маркера для поиска в MapController
  useLayoutEffect(() => {
    if (markerRef.current) {
      // Добавляем driverId в опции маркера для поиска в MapController
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (markerRef.current as any).options.driverId = driver.id;

      // eslint-disable-next-line no-console
      console.log('🏷️ DriverMarker: Установлен driverId в опции маркера', { driverId: driver.id });
    }
  }, [driver.id]);

  // Автоматически открываем попап если forceOpenPopup = true И загружаем данные
  useLayoutEffect(() => {
    if (forceOpenPopup) {
      // Загружаем данные водителя если их нет
      if (loadDriverData && !fullDriverData) {
        setIsLoadingData(true);
        loadDriverData(driver.id).finally(() => {
          setIsLoadingData(false);
        });
      }

      // Открываем popup с задержкой, чтобы маркер успел отрендериться
      const timer = setTimeout(() => {
        if (popupRef.current) {
          popupRef.current.openPopup();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [forceOpenPopup, driver.id, loadDriverData, fullDriverData]);

  return (
    <Marker
      ref={markerRef}
      key={`driver-${driver.id}`}
      position={[driver.currentLocation.latitude, driver.currentLocation.longitude]}
      icon={createDriverIcon(driver.serviceClass, isSelected, heading, uiScale)}
      eventHandlers={{
        click: handleMarkerClick,
      }}
    >
      <Popup ref={popupRef}>
        <div
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
          }}
        >
          {/* Заголовок */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginBottom: '1rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0,
              }}
            >
              Информация о водителе
            </h3>
            <button
              onClick={() => {
                const profileUrl = `http://compass.local:3009/users/driver/${driver.id}`;

                window.open(profileUrl, '_blank');
              }}
              style={{
                padding: '0.25rem',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              title='Открыть профиль водителя в новой вкладке'
            >
              <ExternalLink style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
            </button>
            {isSelected && (
              <span
                style={{
                  fontSize: '0.75rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                ✓ Выбран
              </span>
            )}
          </div>

          {/* Основной контент */}
          {isLoadingData ? (
            // Спиннер загрузки
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                minHeight: '150px',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #f3f4f6',
                  borderTop: '4px solid #3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginBottom: '1rem',
                }}
              />
              <p
                style={{
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                Загружаем данные водителя...
              </p>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : (
            // Основной контент
            <div>
              {/* Контент в две колонки */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                }}
              >
                {/* Левая колонка - Водитель */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {/* Аватар */}
                    <div
                      style={{
                        width: '3rem',
                        height: '3rem',
                        borderRadius: '50%',
                        backgroundColor: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.5rem',
                        fontSize: '1.5rem',
                      }}
                    >
                      👤
                    </div>

                    {/* Имя */}
                    <h4
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#111827',
                        margin: 0,
                        textAlign: 'center',
                      }}
                    >
                      {(fullDriverData?.fullName as string) || 'Водитель'}
                    </h4>
                  </div>

                  {/* Контактная информация */}
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <span>📞</span>
                      <span>{(fullDriverData?.phoneNumber as string) || 'Не указан'}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <span>✉️</span>
                      <span>{(fullDriverData?.email as string) || 'Не указан'}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <span>{fullDriverData?.online ? '🟢' : '🔴'}</span>
                      <span>{fullDriverData?.online ? 'Онлайн' : 'Оффлайн'}</span>
                    </div>
                    {/* Кнопка написать сообщение */}
                    <button
                      type='button'
                      onClick={() => {
                        // Заглушка - пока ничего не делаем
                        // eslint-disable-next-line no-console
                        console.log('Написать сообщение водителю:', driver.id);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.3rem 1rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        marginTop: '0.5rem',
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.backgroundColor = '#2563eb';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.backgroundColor = '#3b82f6';
                      }}
                    >
                      💬 сообщение
                    </button>
                  </div>
                </div>

                {/* Правая колонка - Автомобиль */}
                <div>
                  {/* Изображение автомобиля */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginBottom: '1rem',
                    }}
                  >
                    <Image
                      src='/auto/eqm5_black.png'
                      alt='Автомобиль'
                      width={100}
                      height={60}
                      style={{
                        objectFit: 'contain',
                        borderRadius: '0.5rem',
                        backgroundColor: '#f9fafb',
                        padding: '0.5rem',
                        width: '100%',
                      }}
                    />
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <div style={{ fontWeight: '500', color: '#374151' }}>Марка и модель:</div>
                      <div>
                        {String(
                          (fullDriverData?.activeCar as Record<string, unknown>)?.make ||
                            'Неизвестно',
                        )}{' '}
                        {String(
                          (fullDriverData?.activeCar as Record<string, unknown>)?.model ||
                            CarTypeValues[driver.type as unknown as CarType] ||
                            driver.type,
                        )}
                      </div>
                    </div>

                    <div style={{ marginBottom: '0.5rem' }}>
                      <div style={{ fontWeight: '500', color: '#374151' }}>Тип автомобиля:</div>
                      <div>{CarTypeValues[driver.type as unknown as CarType] || driver.type}</div>
                    </div>

                    <div style={{ marginBottom: '0.5rem' }}>
                      <div style={{ fontWeight: '500', color: '#374151' }}>Класс обслуживания:</div>
                      <div
                        style={{
                          display: 'inline-block',
                          backgroundColor: '#dbeafe',
                          color: '#1e40af',
                          padding: '0.125rem 0.375rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.6875rem',
                          fontWeight: '500',
                        }}
                      >
                        {ServiceClassValues[driver.serviceClass as unknown as ServiceClass] ||
                          driver.serviceClass}
                      </div>
                    </div>

                    <div className='flex flex-row gap-4'>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <div style={{ fontWeight: '500', color: '#374151' }}>Номер:</div>
                        <div>
                          {String(
                            (fullDriverData?.activeCar as Record<string, unknown>)?.licensePlate ||
                              'Не указан',
                          )}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontWeight: '500', color: '#374151' }}>Цвет:</div>
                        <div>
                          {String(
                            (fullDriverData?.activeCar as Record<string, unknown>)?.color ||
                              'Не указан',
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Кнопки действий */}
              {onDriverSelect && (
                <div
                  style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  {/* Основные кнопки выбора водителя - скрыты для партнеров */}
                  {userRole !== 'partner' && (
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                      }}
                    >
                      {isSelected ? (
                        <button
                          type='button'
                          onClick={() => {
                            onDriverSelect('');
                          }}
                          style={{
                            flex: 1,
                            padding: '0.5rem 1rem',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                          }}
                          onMouseOver={e => {
                            e.currentTarget.style.backgroundColor = '#dc2626';
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.backgroundColor = '#ef4444';
                          }}
                        >
                          ❌ Отменить водителя
                        </button>
                      ) : (
                        <button
                          type='button'
                          onClick={() => {
                            onDriverSelect(driver);
                          }}
                          style={{
                            flex: 1,
                            padding: '0.5rem 1rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                          }}
                          onMouseOver={e => {
                            e.currentTarget.style.backgroundColor = '#16a34a';
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.backgroundColor = '#22c55e';
                          }}
                        >
                          ✅ Выбрать водителя
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

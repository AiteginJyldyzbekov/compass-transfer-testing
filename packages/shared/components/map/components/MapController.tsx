'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface MapControllerProps {
  center?: { latitude: number; longitude: number } | null;
  zoom?: number;
  openPopupDriverId?: string | null;
}

/**
 * Компонент для программного управления картой
 */
export const MapController: React.FC<MapControllerProps> = ({ center, zoom = 16, openPopupDriverId }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      // Плавно перемещаем карту к новому центру
      map.setView([center.latitude, center.longitude], zoom, {
        animate: true,
        duration: 1.0 // 1 секунда анимации
      });
    }
  }, [center, zoom, map]);

  // Открываем popup водителя
  useEffect(() => {
    if (openPopupDriverId) {
      // eslint-disable-next-line no-console
      console.log('🔍 MapController: Ищем маркер водителя', { openPopupDriverId });

      // Если есть центр (карта перемещается), ждем завершения анимации
      const delay = center ? 1100 : 100; // Если карта не перемещается, открываем сразу

      const timer = setTimeout(() => {
        let found = false;
        // Ищем маркер водителя по ID и открываем его popup
        map.eachLayer((layer: any) => {
          if (layer.options && layer.options.driverId === openPopupDriverId) {
            // eslint-disable-next-line no-console
            console.log('✅ MapController: Найден маркер водителя, открываем popup', { driverId: openPopupDriverId });
            layer.openPopup();
            found = true;
          }
        });

        if (!found) {
          // eslint-disable-next-line no-console
          console.log('❌ MapController: Маркер водителя не найден', { openPopupDriverId });
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [openPopupDriverId, center, map]);

  return null;
};

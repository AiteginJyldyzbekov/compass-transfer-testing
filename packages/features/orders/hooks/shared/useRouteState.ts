'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { logger } from '@shared/lib/logger';
import type { GetLocationDTO } from '@entities/locations/interface';

export interface RouteState {
  start: GetLocationDTO | null;
  additional: (GetLocationDTO | null)[]; // точки между начальной и конечной, могут быть null для пустых слотов
  end: GetLocationDTO | null;
}

export type RoutePointType = 'start' | 'additional' | 'end';

export interface RoutePoint {
  type: RoutePointType;
  location: GetLocationDTO | null;
  label: string;
}

/**
 * Приводим плоский массив локаций (как хранится в форме) к объекту RouteState
 */
const arrayToState = (locations: GetLocationDTO[]): RouteState => {
  if (locations.length === 0) return { start: null, additional: [], end: null };

  if (locations.length === 1) {
    return { start: locations[0], additional: [], end: null };
  }

  const start = locations[0];
  const end = locations[locations.length - 1];
  const additional = locations.length > 2 ? locations.slice(1, -1) : [];

  return { start, additional, end };
};

/**
 * Конвертируем RouteState обратно в плоский массив локаций
 */
const stateToArray = (state: RouteState): GetLocationDTO[] => {
  const arr: (GetLocationDTO | null)[] = [];

  if (state.start) arr.push(state.start);
  // Фильтруем null, которые могут оставаться после удаления точек
  arr.push(...state.additional.filter(Boolean));
  if (state.end) arr.push(state.end);

  // Возвращаем только валидные локации (без null)
  return arr.filter(Boolean) as GetLocationDTO[];
};

/**
 * Хук для строгого управления состоянием маршрута
 * Всегда хранит отдельно start / additional[] / end и уведомляет родителя плоским массивом
 */
export const useRouteState = (
  externalLocations: GetLocationDTO[],
  onChange: (locations: GetLocationDTO[]) => void,
  maxPoints: number = 5,
) => {
  // Локальное состояние синхронизируем с пропсом
  const [state, setState] = useState<RouteState>(() => arrayToState(externalLocations));

  // ✅ ИСПРАВЛЕНИЕ: Флаг для предотвращения автовосстановления
  const userModifiedRef = useRef(false);
  const lastExternalIdsRef = useRef('');

  // Синхронизируемся при изменении пропса
  useEffect(() => {
    const extIds = externalLocations.map(l => l.id).join(',');
    const intIds = stateToArray(state)
      .map(l => l.id)
      .join(',');

    // ✅ ИСПРАВЛЕНИЕ: Более умная синхронизация
    // 1. Если это первая инициализация (lastExternalIds пустой) - синхронизируем
    // 2. Если внешние данные изменились, но пользователь не модифицировал - синхронизируем
    // 3. Если пользователь модифицировал и внешние данные пустые - НЕ синхронизируем

    const isFirstInit = lastExternalIdsRef.current === '';
    const externalChanged = extIds !== lastExternalIdsRef.current;
    const shouldSync =
      (isFirstInit || externalChanged) &&
      !(userModifiedRef.current && externalLocations.length === 0);

    if (shouldSync && extIds !== intIds) {
      logger.info('🔄 useRouteState: синхронизация с внешними локациями:', {
        external: extIds,
        internal: intIds,
        isFirstInit,
        externalChanged,
        userModified: userModifiedRef.current,
        externalCount: externalLocations.length,
      });
      setState(arrayToState(externalLocations));
    }

    lastExternalIdsRef.current = extIds;
  }, [externalLocations, state]);

  // Утилита: уведомить родителя и обновить локалку
  const updateState = useCallback((next: RouteState) => {
    userModifiedRef.current = true; // ✅ Помечаем что пользователь изменил состояние
    setState(next);
    onChange(stateToArray(next));
  }, [onChange]);

  // ===== ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ СОЗДАНИЯ СПИСКА ТОЧЕК =====
  const computeRoutePoints = (s: RouteState): RoutePoint[] => {
    const pts: RoutePoint[] = [
      { type: 'start', location: s.start, label: 'Точка A (начало поездки)' },
    ];

    s.additional.forEach((loc, idx) => {
      pts.push({ type: 'additional', location: loc, label: `Доп точка ${idx + 1}` });
    });
    pts.push({ type: 'end', location: s.end, label: 'Точка B (конец поездки)' });

    return pts;
  };

  /* =============================== Методы =============================== */
  const setStart = useCallback((location: GetLocationDTO | null) => {
    updateState({ ...state, start: location });
  }, [state, updateState]);

  const setEnd = useCallback((location: GetLocationDTO | null) => {
    updateState({ ...state, end: location });
  }, [state, updateState]);

  const addAdditional = useCallback((location: GetLocationDTO) => {
    // сначала найдем пустой слот
    const emptyIndex = state.additional.findIndex(a => a === null);
    // Жёстко ограничиваем количество ДОПОЛНИТЕЛЬНЫХ точек (не считая start/end)
    const additionalCount = state.additional.filter(Boolean).length;
    const maxAdditional = Math.max(0, maxPoints - 2); // 2 резервируем под start и end

    if (additionalCount >= maxAdditional) {
      return;
    }

    // Дополнительно проверяем общее число точек на всякий случай
    const totalPoints = (state.start ? 1 : 0) + additionalCount + (state.end ? 1 : 0);

    if (totalPoints >= maxPoints) {
      return;
    }

    const newAdditional = [...state.additional];

    if (emptyIndex !== -1) {
      newAdditional[emptyIndex] = location;
    } else {
      newAdditional.push(location);
    }
    updateState({ ...state, additional: newAdditional });
  }, [state, maxPoints, updateState]);

  const updateAdditional = useCallback((index: number, location: GetLocationDTO | null) => {
    const newAdditional = [...state.additional];

    // обеспечиваем наличие нужного индекса
    while (index >= newAdditional.length) {
      newAdditional.push(null);
    }
    newAdditional[index] = location;
    updateState({ ...state, additional: newAdditional });
  }, [state, updateState]);

  // Выбор локации для точки по индексу (используется панелью)
  const selectLocationForPoint = useCallback((location: GetLocationDTO, pointIndex: number) => {
    if (pointIndex === -1) {
      addAdditional(location);

      return;
    }
    const points = computeRoutePoints(state);
    const point = points[pointIndex];

    if (!point) return;

    switch (point.type) {
      case 'start':
        setStart(location);
        break;
      case 'end':
        setEnd(location);
        break;
      case 'additional':
        updateAdditional(pointIndex - 1, location); // index-1 потому что start = 0
        break;
    }
  }, [state, addAdditional, setStart, setEnd, updateAdditional]);

  const removeRoutePoint = useCallback((pointIndex: number) => {
    const points = computeRoutePoints(state);
    const point = points[pointIndex];

    if (!point) return;

    switch (point.type) {
      case 'start':
        setStart(null);
        break;
      case 'end':
        setEnd(null);
        break;
      case 'additional':
        updateAdditional(pointIndex - 1, null);
        break;
    }
  }, [state, setStart, setEnd, updateAdditional]);

  const addAdditionalPoint = useCallback((location: GetLocationDTO) => addAdditional(location), [addAdditional]);

  /* =========================== Derivatives ============================= */
  const routePoints = useMemo(() => computeRoutePoints(state), [state]);
  const flatLocations = useMemo(() => stateToArray(state), [state]);

  // Функции для карты (toggle)
  const addLocationSmart = useCallback((location: GetLocationDTO) => {
    if (!state.start) {
      setStart(location);
    } else if (!state.end) {
      setEnd(location);
    } else {
      addAdditional(location);
    }
  }, [state, setStart, setEnd, addAdditional]);

  const removeLocationById = useCallback((locationId: string) => {
    if (state.start?.id === locationId) {
      setStart(null);

      return;
    }
    if (state.end?.id === locationId) {
      setEnd(null);

      return;
    }
    const idx = state.additional.findIndex(l => l?.id === locationId);

    if (idx >= 0) {
      updateAdditional(idx, null);
    }
  }, [state, setStart, setEnd, updateAdditional]);

  return {
    state,
    routePoints,
    flatLocations,
    // панели
    selectLocationForPoint,
    removeRoutePoint,
    addAdditionalPoint,
    // карта
    addLocationSmart,
    removeLocationById,
    // прямые сеттеры если понадобятся
    setStart,
    setEnd,
  };
};

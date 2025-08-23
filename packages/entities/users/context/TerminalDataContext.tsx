'use client';

import { createContext, useContext } from 'react';
import type { GetLocationDTO } from '@entities/locations/interface';
import type { GetTerminalDTO } from '../interface';

export interface TerminalDataContextType {
  // Профиль пользователя
  profile: GetTerminalDTO | null;
  isProfileLoading: boolean;
  profileError: string | null;
  
  // Локация терминала
  terminalLocation: GetLocationDTO | null;
  isLocationLoading: boolean;
  locationError: string | null;
  
  // Общие состояния
  isLoading: boolean;
  error: string | null;
  
  // Методы
  refetchProfile: () => Promise<void>;
  refetchLocation: () => Promise<void>;
  refetchAll: () => Promise<void>;
}

export const TerminalDataContext = createContext<TerminalDataContextType | null>(null);

/**
 * Хук для использования данных терминала
 * @returns {TerminalDataContextType} Контекст данных терминала
 * @throws {Error} Если хук используется вне провайдера
 */
export const useTerminalData = (): TerminalDataContextType => {
  const context = useContext(TerminalDataContext);

  if (!context) {
    throw new Error('useTerminalData должен использоваться внутри TerminalDataProvider');
  }

  return context;
}; 
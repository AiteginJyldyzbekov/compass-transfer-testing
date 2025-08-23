'use client';

import { createContext, useContext } from 'react';
import type { GetTariffDTO } from '../interface';

export interface TerminalTariffContextType {
  economyTariff: GetTariffDTO | null;
  tariffs: GetTariffDTO[];
  isLoading: boolean;
  error: string | null;
}

export const TerminalTariffContext = createContext<TerminalTariffContextType | undefined>(undefined);

/**
 * Хук для использования контекста тарифов терминала
 */
export const useTerminalTariff = (): TerminalTariffContextType => {
  const context = useContext(TerminalTariffContext);
  
  if (context === undefined) {
    throw new Error('useTerminalTariff must be used within a TerminalTariffProvider');
  }
  
  return context;
}; 
'use client';

/**
 * Хук для работы с SignalR
 */
import { useContext, createContext, type ReactNode } from 'react';
import type { SignalREventHandler } from '@shared/hooks/signal/types';


/**
 * Интерфейс для SignalR контекста  
 */
export interface SignalRContextType {
  connection: WebSocket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  on: SignalREventHandler;
  off: SignalREventHandler;
}

/**
 * SignalR контекст
 */
export const SignalRContext = createContext<SignalRContextType | null>(null);

/**
 * Пропсы для SignalR провайдера
 */
export interface SignalRProviderProps {
  children: ReactNode;
  accessToken?: string;
} 

/**
 * Результат хука useSignalR
 */
export interface UseSignalRResult extends SignalRContextType {
  // Все поля наследуются от SignalRContextType
}
/**
 * Хук для работы с SignalR контекстом
 */
export function useSignalR(): UseSignalRResult {
  const context = useContext(SignalRContext);

  if (!context) {
    throw new Error('useSignalR must be used within a SignalRProvider');
  }

  return context;
}

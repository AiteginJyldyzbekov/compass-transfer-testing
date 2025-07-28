import type { SignalREventMap, SignalRCallback, TypedSignalRCallback } from "@entities/ws/types/signalr.types";

/**
 * Generic интерфейс для обработчиков событий
 */
export interface SignalREventHandler {
    <K extends keyof SignalREventMap>(event: K, callback: TypedSignalRCallback<K>): void;
    (event: string, callback: SignalRCallback): void; // Fallback
  }
  
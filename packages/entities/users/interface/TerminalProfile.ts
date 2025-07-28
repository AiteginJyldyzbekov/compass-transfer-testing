/**
 * Интерфейс TerminalProfile
 * @interface
 */
export interface TerminalProfile {
  terminalId: string;
  ipAddress?: string | null;
  deviceModel?: string | null;
  osVersion?: string | null;
  appVersion?: string | null;
  browserInfo?: string | null;
  screenResolution?: string | null;
  deviceIdentifier?: string | null;
}
import { FiscalStatus } from '../enums/fiscal-enums';

/**
 * Ошибка фискальной операции
 */
export class FiscalError extends Error {
  constructor(
    public readonly status: FiscalStatus,
    message: string,
    public readonly details?: {
      extCode?: number;
      extCode2?: number;
    },
  ) {
    super(message);
    this.name = 'FiscalError';
  }

  /**
   * Проверяет, является ли ошибка критической
   */
  get isCritical(): boolean {
    return [
      FiscalStatus.FISCAL_CORE_ERROR,
      FiscalStatus.LICENSE_EXPIRED,
      FiscalStatus.INTERNAL_SERVICE_ERROR,
    ].includes(this.status);
  }

  /**
   * Проверяет, является ли ошибка ошибкой печати (документ уже создан)
   */
  get isPrintError(): boolean {
    return [FiscalStatus.PRINTER_ERROR, FiscalStatus.PRINTER_BUSY].includes(this.status);
  }
}

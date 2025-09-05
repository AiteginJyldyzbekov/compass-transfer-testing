'use client';

import {
  FiscalNodeType,
  FiscalStatus,
} from '../enums/fiscal-enums';
import { FiscalError } from '../interface/fiscal-error';
import type {
  FiscalResponse,
  FiscalState,
  TaxiReceiptData,
  FiscalVersion,
  RegistrationStatus,
} from '../interface/fiscal-types';

/**
 * Сервис для работы с NewCas Fiscal API
 * Выполняется в браузере терминала и обращается к localhost NewCas
 */
export class FiscalService {
  private baseUrl: string;
  private timeout: number = 30000;
  private lastShiftCheck: number = 0;
  private shiftCheckInterval: number = 20 * 60 * 60 * 1000; // 20 часов
  private backgroundCheckInterval: NodeJS.Timeout | null = null;
  private registrationNumber?: string;

  constructor(_nodeType: FiscalNodeType = FiscalNodeType.CLOUD, registrationNumber?: string) {
    const port = process.env.NEXT_PUBLIC_FISCAL_PORT || '4445';

    this.baseUrl = `http://localhost:${port}`;
    this.registrationNumber = registrationNumber;
    
    // Запускаем фоновую проверку смены каждые 30 минут
    this.startBackgroundShiftCheck();
  }

  /**
   * Запуск фоновой проверки смены каждые 30 минут
   */
  private startBackgroundShiftCheck(): void {
    this.backgroundCheckInterval = setInterval(async () => {
      try {
        await this.backgroundShiftCheck();
      } catch {
        // Игнорируем ошибки в фоновой проверке
      }
    }, 30 * 60 * 1000); // 30 минут
  }

  /**
   * Фоновая проверка и управление сменой
   */
  private async backgroundShiftCheck(): Promise<void> {
    const now = Date.now();
    
    // Проверяем только если прошло более 20 часов с последней проверки
    if (now - this.lastShiftCheck < this.shiftCheckInterval && this.lastShiftCheck > 0) {
      return;
    }

    try {
      const state = await this.getState();
      
      if (state.status !== undefined && state.status !== 0) {
        return; // Фискальный накопитель недоступен
      }

      await this.checkAndManageShift(state);
    } catch {
      // Игнорируем ошибки фоновой проверки
    }
  }

  /**
   * Остановка фоновой проверки
   */
  public stopBackgroundShiftCheck(): void {
    if (this.backgroundCheckInterval) {
      clearInterval(this.backgroundCheckInterval);
      this.backgroundCheckInterval = null;
    }
  }

  /**
   * Универсальный метод для отправки запросов к Fiscal API
   */
  private async fiscalRequest<T>(endpoint: string, data: Record<string, unknown> = {}): Promise<T> {
    const requestBody = {
      ...data,
      ...(this.registrationNumber && { registrationNumber: this.registrationNumber }),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const fiscalResponse: FiscalResponse<T> = await response.json();

      // Проверяем статус фискального ответа
      if (fiscalResponse.status !== FiscalStatus.SUCCESS) {
        throw new FiscalError(
          fiscalResponse.status,
          fiscalResponse.errorMessage || 'Неизвестная ошибка фискальной операции',
          {
            extCode: fiscalResponse.extCode,
            extCode2: fiscalResponse.extCode2,
          },
        );
      }

      return fiscalResponse.data || ({} as T);
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof FiscalError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new FiscalError(
          FiscalStatus.FISCAL_CORE_ERROR,
          `Таймаут запроса к ${endpoint} (${this.timeout}ms)`
        );
      }
      
      throw new FiscalError(
        FiscalStatus.INTERNAL_SERVICE_ERROR,
        `Ошибка соединения с фискальным сервисом: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Получить версию NewCas Fiscal
   */
  async getVersion(): Promise<FiscalVersion> {
    return this.fiscalRequest<FiscalVersion>('/GetVersion');
  }

  /**
   * Получить статус регистрации ФН
   */
  async getRegistrationStatus(): Promise<RegistrationStatus> {
    return this.fiscalRequest<RegistrationStatus>('/GetRegistrationStatus');
  }

  /**
   * Получить состояние фискального накопителя
   */
  async getState(): Promise<FiscalState> {
    return this.fiscalRequest<FiscalState>('/fiscal/shifts/getState/');
  }

  /**
   * Открыть рабочую смену
   */
  async openDay(cashierName: string = 'Терминал'): Promise<void> {
    await this.fiscalRequest<void>('/fiscal/shifts/openDay/', {
      cashierName,
      ignoreOpenShift: true, // игнорируем если смена уже открыта
    });
  }

  /**
   * Закрыть рабочую смену
   */
  async closeDay(cashierName: string = 'Терминал'): Promise<void> {
    await this.fiscalRequest<void>('/fiscal/shifts/closeDay/', {
      cashierName,
      printToBitmaps: false, // не нужны картинки, только закрыть смену
    });
  }

  /**
   * Проверка и управление состоянием смены с кешированием
   */
  private async checkAndManageShift(state: FiscalState): Promise<void> {
    const now = Date.now();
    
    // Проверяем только если прошло более 20 часов с последней проверки
    if (now - this.lastShiftCheck < this.shiftCheckInterval && this.lastShiftCheck > 0) {
      return;
    }

    this.lastShiftCheck = now;

    // dayState: 0 = закрыта, 1 = открыта
    if (state.dayState === 0) {
      await this.openDay();

      // Проверяем еще раз после открытия
      const newState = await this.getState();

      if (newState.dayState !== 1) {
        throw new FiscalError(FiscalStatus.FISCAL_CORE_ERROR, 'Не удалось открыть рабочую смену');
      }
    } else if (state.dayState === 1) {
      // Проверяем не истекла ли смена (24 часа)
      if (state.isShiftExpired) {
        // Закрываем старую смену
        await this.closeDay();

        // Открываем новую смену
        await this.openDay();

        // Проверяем еще раз
        const newState = await this.getState();

        if (newState.dayState !== 1 || newState.isShiftExpired) {
          throw new FiscalError(FiscalStatus.FISCAL_CORE_ERROR, 'Не удалось переоткрыть смену');
        }
      }
    }
  }

  /**
   * Создать и закрыть чек одним запросом
   */
  async openAndCloseRec(payload: Record<string, unknown>): Promise<void> {
    await this.fiscalRequest<void>('/fiscal/bills/openAndCloseRec/', payload);
  }

  /**
   * Аннулировать последний чек
   */
  async voidReceipt(): Promise<void> {
    await this.fiscalRequest<void>('/fiscal/bills/recVoid/', {});
  }

  /**
   * Выполнить платеж через POS-терминал
   */
  async executePayment(
    amount: number,
    type = '',
  ): Promise<{
    result: string;
    id: string;
    status: 'Pending' | 'Success' | 'Failed';
    reason?: string;
  }> {
    // API требует строковое значение для суммы
    const body = {
      type,
      amount: amount.toString(),
    };

    try {
      // executePayment может возвращать не стандартную структуру FiscalResponse
      // поэтому обрабатываем его отдельно
      const response = await fetch(`${this.baseUrl}/fiscal/payments/executePayment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const rawResult = await response.json();

      // Если ответ пустой или undefined, считаем успешным
      if (!rawResult || rawResult === null) {
        return {
          result: 'success',
          id: `pos_payment_${Date.now()}`,
          status: 'Success',
          reason: undefined,
        };
      }

      // Если есть поле status в корне (не в data), используем его
      if (rawResult.status !== undefined) {
        return {
          result: rawResult.result || 'success',
          id: rawResult.id || `pos_payment_${Date.now()}`,
          status: rawResult.status === 0 ? 'Success' : 'Failed',
          reason: rawResult.reason || rawResult.errorMessage,
        };
      }

      // Иначе используем стандартную обработку
      return rawResult;
    } catch (error) {
      throw new FiscalError(
        FiscalStatus.INTERNAL_SERVICE_ERROR,
        `Ошибка выполнения платежа: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Создать полный чек для поездки на такси
   * Основной метод для терминального приложения
   */
  async createTaxiReceipt(data: TaxiReceiptData): Promise<void> {
    try {
      // 1. Проверяем состояние ФН
      const state = await this.getState();

      // Проверяем что запрос выполнен успешно (status === 0)
      if (state.status !== undefined && state.status !== 0) {
        throw new FiscalError(
          FiscalStatus.FISCAL_CORE_ERROR,
          `Фискальный накопитель вернул ошибку: status=${state.status}`,
        );
      }

      // 2. Проверяем рабочую смену (оптимизированная проверка)
      await this.checkAndManageShift(state);

      // 3. Создаём чек одной командой
      // ВАЖНО: API требует строковые значения для сумм
      const roundedPrice = Math.round(data.price * 100) / 100;

      const receiptPayload = {
        recType: 1, // приход
        goods: [
          {
            itemName: `Поездка: ${data.route}`,
            total: roundedPrice.toString(),
            vatNum: 0,
            price: roundedPrice.toString(),
            count: 1, // в примере число, не строка
            calcType: 1, // 1 = услуга (для такси)
            article: '',
            stNum: 0,
          },
        ],
        payItems: [
          {
            total: roundedPrice.toString(), // API требует строку
            payType: 1, // 1 – безнал
            // Для предоплаченных методов (карта через POS, QR) платеж уже проведен
            ...((data.paymentMethod === 'CARD' || data.paymentMethod === 'QR') && { paid: true }),
          },
        ],
      };

      await this.openAndCloseRec(receiptPayload);

    } catch (error) {
      // Обрабатываем ошибку истечения смены
      if (error instanceof FiscalError && error.message && error.message.includes('Смена не может превышать 24 часа')) {
        try {
          // Закрываем старую смену
          await this.closeDay();
          // Открываем новую
          await this.openDay();

          // Рекурсивно вызываем себя же для повторной попытки
          return await this.createTaxiReceipt(data);
        } catch {
          throw new FiscalError(
            FiscalStatus.FISCAL_CORE_ERROR,
            'Не удалось переоткрыть смену для создания чека',
          );
        }
      }

      // Если это ошибка печати - документ уже создан, не пытаемся аннулировать
      if (error instanceof FiscalError && error.isPrintError) {
        throw error;
      }

      throw error;
    }
  }

  /**
   * Проверить готовность ФН к работе
   */
  async checkReadiness(): Promise<{
    isReady: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];

    try {
      // Проверяем базовое состояние
      const state = await this.getState();

      // Проверяем статус (0 = успех)
      if (state.status !== 0) {
        issues.push(
          `Фискальный накопитель вернул ошибку: ${state.errorMessage || `status=${state.status}`}`,
        );
      }

      // Проверяем наличие регистрационного номера
      if (!state.registrationNumber) {
        issues.push('Фискальный накопитель не зарегистрирован');
      }

      // Проверяем не истекла ли смена
      if (state.isShiftExpired) {
        issues.push('Смена истекла, требуется закрыть и открыть новую');
      }

      // Проверяем смену (dayState: 1 = открыта)
      if (state.dayState !== 1) {
        issues.push('Рабочая смена не открыта');
      }

      return {
        isReady: issues.length === 0,
        issues,
      };
    } catch (error) {
      issues.push(
        `Ошибка соединения с ФН: ${error instanceof Error ? error.message : String(error)}`,
      );

      return {
        isReady: false,
        issues,
      };
    }
  }

  /**
   * Печать растрового изображения
   * @param rasterBase64 - изображение в формате Base64, не более 384 пикселей в ширину
   * @param cutPaper - обрезать бумагу после печати (по умолчанию false)
   */
  async printRaster(rasterBase64: string, cutPaper: boolean = false): Promise<void> {
    try {
      await this.fiscalRequest<void>('/fiscal/bills/printRaster/', {
        raster: rasterBase64,
        cutPaper,
      });
    } catch (error) {
      throw new FiscalError(
        FiscalStatus.PRINTER_ERROR,
        `Ошибка печати растрового изображения: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Печать строки на чеке
   * @param line - текст строки
   * @param align - выравнивание (0-лево, 1-центр, 2-право)
   * @param cutPaper - обрезать бумагу после печати (по умолчанию false)
   */
  async printLine(line: string, align: number = 0, cutPaper: boolean = false): Promise<void> {
    try {
      await this.fiscalRequest<void>('/fiscal/bills/printLine/', {
        line,
        align,
        cutPaper,
      });
    } catch (error) {
      throw new FiscalError(
        FiscalStatus.PRINTER_ERROR,
        `Ошибка печати строки: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Обрезать бумагу
   */
  async cutPaper(): Promise<void> {
    try {
      await this.fiscalRequest<void>('/fiscal/bills/cutPaper/', {});
    } catch (error) {
      throw new FiscalError(
        FiscalStatus.PRINTER_ERROR,
        `Ошибка обрезания бумаги: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Печать чека такси построчно одним запросом
   * @param data - данные для печати чека
   * @param cutPaper - обрезать бумагу после печати (по умолчанию true для обратной совместимости)
   */
  async printTaxiReceiptLines(data: {
    price: number;
    route: string;
    paymentMethod: string;
    orderNumber: string;
    driver?: {
      fullName: string;
      phoneNumber?: string;
    };
    car?: {
      make: string;
      model: string;
      licensePlate: string;
      color: string;
    };
    queueNumber?: string;
  }, cutPaper: boolean = true): Promise<void> {
    // Форматируем дату
    const date = new Date();
    const formattedDate = date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
    const formattedTime = date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Формируем массив строк для печати
    const lines: string[] = [];
    
    // Заголовок
    lines.push('');
    lines.push('===============================');
    lines.push('      ТРАНЗАКЦИЯ УСПЕШНА');
    lines.push('===============================');
    lines.push('');
    
    // Детали заказа
    lines.push(`Дата:                    ${formattedDate} ${formattedTime}`);
    lines.push(`Маршрут:                 ${data.route}`);
    lines.push(`Номер заказа:            ${data.orderNumber}`);
    
    // Информация о машине
    if (data.car) {
      lines.push('');
      lines.push('--- ИНФОРМАЦИЯ О МАШИНЕ ---');
      lines.push(`Гос. номер:              ${data.car.licensePlate}`);
      lines.push(`Марка:                   ${data.car.make}`);
      lines.push(`Модель:                  ${data.car.model}`);
      if (data.car.color) {
        lines.push(`Цвет:                    ${data.car.color}`);
      }
    }
    
    if (data.queueNumber) {
      lines.push(`Номер очереди:           ${data.queueNumber}`);
    }
    
    // Водитель
    if (data.driver) {
      lines.push(`Водитель:                ${data.driver.fullName}`);
      if (data.driver.phoneNumber) {
        lines.push(`Телефон:                 ${data.driver.phoneNumber}`);
      }
    }
    
    // Благодарность
    lines.push('');
    lines.push('===============================');
    lines.push('');
    lines.push('    Спасибо за использование');
    lines.push('        сервиса Compass');
    lines.push('');
    lines.push('-------------------------------');
    lines.push('');

    try {
      // Отправляем все строки ОДНИМ запросом
      const textContent = lines.join('\n');

      await this.fiscalRequest<void>('/fiscal/bills/printText/', {
        text: textContent,
        cutPaper // Используем переданный параметр
      });
      
    } catch (error) {
      throw error;
    }
  }

  /**
   * Печать чека с логотипом: сначала логотип, затем текст, затем обрезание
   * @param logoBase64 - логотип в формате Base64
   * @param data - данные для печати чека
   */
  async printTaxiReceiptWithLogo(logoBase64: string, data: {
    price: number;
    route: string;
    paymentMethod: string;
    orderNumber: string;
    driver?: {
      fullName: string;
      phoneNumber?: string;
    };
    car?: {
      make: string;
      model: string;
      licensePlate: string;
      color: string;
    };
    queueNumber?: string;
  }): Promise<void> {
    try {
      // 1. Печатаем логотип БЕЗ обрезания бумаги
      await this.printRaster(logoBase64, false);
      
      // 2. Печатаем текст чека БЕЗ обрезания бумаги
      await this.printTaxiReceiptLines(data, false);
      
      // 3. Обрезаем бумагу в конце
      await this.cutPaper();
      
    } catch (error) {
      throw error;
    }
  }
}

// Экспортируем экземпляр сервиса для использования в приложении
export const fiscalService = new FiscalService();

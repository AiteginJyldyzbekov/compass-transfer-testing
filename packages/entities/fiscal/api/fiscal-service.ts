'use client';

import {
  FiscalNodeType,
  FiscalStatus,
  type ReceiptType,
  type TaxSystem,
  type VATRate,
  type NSPRate,
  type CalcType,
  type PayType,
} from '../enums/fiscal-enums';
import { FiscalError } from '../interface/fiscal-error';
import type {
  FiscalResponse,
  FiscalState,
  DayState,
  TaxiReceiptData,
  FiscalVersion,
  RegistrationStatus,
} from '../interface/fiscal-types';

/**
 * Сервис для работы с NewCas Fiscal API
 * Выполняется в браузере терминала и обращается к localhost NewCas
 */
export class FiscalService {
  private readonly baseUrl: string;
  private readonly registrationNumber?: string;

  constructor(_nodeType: FiscalNodeType = FiscalNodeType.CLOUD, registrationNumber?: string) {
    const port = process.env.NEXT_PUBLIC_FISCAL_PORT || '4445';

    this.baseUrl = `http://localhost:${port}`;
    this.registrationNumber = registrationNumber;
  }

  /**
   * Базовый метод для отправки запросов к фискальному API
   * Выполняется в браузере терминала
   */
  private async fiscalRequest<T>(endpoint: string, data: Record<string, any> = {}): Promise<T> {
    const requestBody = {
      ...data,
      ...(this.registrationNumber && { registrationNumber: this.registrationNumber }),
    };

    console.log(`🧾 Фискальный запрос POST ${endpoint}:`, requestBody);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const fiscalResponse: FiscalResponse<T> = await response.json();
      console.log('📨 Полный ответ от фискального сервиса:', fiscalResponse);
      console.log('🔍 Статус ответа:', fiscalResponse.status);
      console.log('🔍 Ожидаемый статус SUCCESS:', FiscalStatus.SUCCESS);

      // Проверяем статус фискального ответа
      if (fiscalResponse.status !== FiscalStatus.SUCCESS) {
        console.error('❌ Статус НЕ SUCCESS:', {
          status: fiscalResponse.status,
          errorMessage: fiscalResponse.errorMessage,
          extCode: fiscalResponse.extCode,
          extCode2: fiscalResponse.extCode2,
        });
        throw new FiscalError(
          fiscalResponse.status,
          fiscalResponse.errorMessage || 'Неизвестная ошибка фискальной операции',
          {
            extCode: fiscalResponse.extCode,
            extCode2: fiscalResponse.extCode2,
          },
        );
      }

      console.log(`✅ Фискальный ответ ${endpoint}:`, fiscalResponse.data);

      return fiscalResponse.data || ({} as T);
    } catch (error) {
      if (error instanceof FiscalError) {
        throw error;
      }

      console.error(`❌ Ошибка фискального запроса ${endpoint}:`, error);
      throw new FiscalError(
        FiscalStatus.INTERNAL_SERVICE_ERROR,
        `Ошибка соединения с фискальным сервисом: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  // ===========================================
  // БАЗОВЫЕ МЕТОДЫ ПРОВЕРКИ И ИНИЦИАЛИЗАЦИИ
  // ===========================================

  /**
   * Получить версию фискального ПО
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
   * Получить текущее состояние ФН
   */
  async getState(): Promise<FiscalState> {
    return this.fiscalRequest<FiscalState>('/fiscal/shifts/getState/');
  }

  /**
   * Самодиагностика ФН
   */
  async selfTest(): Promise<void> {
    await this.fiscalRequest<void>('/SelfTest');
  }

  // ===========================================
  // УПРАВЛЕНИЕ РАБОЧЕЙ СМЕНОЙ
  // ===========================================

  /**
   * Получить состояние рабочего дня
   */
  async getDayState(): Promise<DayState> {
    return this.fiscalRequest<DayState>('/GetDayState');
  }

  /**
   * Открыть рабочий день
   */
  async openDay(cashierName: string = 'Терминал'): Promise<void> {
    console.log('📅 Открываем рабочий день...');
    await this.fiscalRequest<void>('/fiscal/shifts/openDay/', {
      cashierName,
      ignoreOpenShift: true, // игнорируем если смена уже открыта
    });
  }

  /**
   * Закрыть рабочий день
   */
  async closeDay(cashierName: string = 'Терминал'): Promise<void> {
    console.log('📅 Закрываем рабочий день...');
    await this.fiscalRequest<void>('/fiscal/shifts/closeDay/', {
      cashierName,
      printToBitmaps: false, // не нужны картинки, только закрыть смену
    });
  }

  /**
   * Печать X-отчета (без закрытия смены)
   */
  async printXReport(): Promise<void> {
    console.log('📊 Печатаем X-отчет...');
    await this.fiscalRequest<void>('/PrintXReport');
  }

  // ===========================================
  // СОЗДАНИЕ ЧЕКОВ (ОСНОВНАЯ ФУНКЦИОНАЛЬНОСТЬ)
  // ===========================================

  /**
   * Открыть чек
   */
  async openReceipt(recType: ReceiptType, taxSystem?: TaxSystem): Promise<void> {
    console.log('🧾 Открываем чек...', { recType, taxSystem });
    await this.fiscalRequest<void>('/OpenRec', { recType, taxSystem });
  }

  /**
   * Добавить товар/услугу в чек
   */
  async printReceiptItem(itemData: {
    name: string;
    price: number;
    quantity: number;
    vatNum: VATRate;
    stNum: NSPRate;
    calcType: CalcType;
    payType: PayType;
    department?: number;
    barcode?: string;
  }): Promise<void> {
    console.log('🛒 Добавляем товар в чек...', itemData);

    // Проверяем корректность цены (не более 2 знаков после запятой)
    const roundedPrice = Math.round(itemData.price * 100) / 100;

    await this.fiscalRequest<void>('/PrintRecItem', {
      name: itemData.name,
      price: roundedPrice,
      quantity: itemData.quantity,
      vatNum: itemData.vatNum,
      stNum: itemData.stNum,
      calcType: itemData.calcType,
      payType: itemData.payType,
      ...(itemData.department && { department: itemData.department }),
      ...(itemData.barcode && { barcode: itemData.barcode }),
    });
  }

  /**
   * Установить итог чека
   */
  async printReceiptTotal(total: number, paymentType?: string): Promise<void> {
    console.log('💰 Устанавливаем итог чека...', { total, paymentType });

    // Проверяем корректность суммы
    const roundedTotal = Math.round(total * 100) / 100;

    await this.fiscalRequest<void>('/PrintRecTotal', {
      total: roundedTotal,
      ...(paymentType && { paymentType }),
    });
  }

  /**
   * Закрыть чек
   */
  async closeReceipt(): Promise<void> {
    console.log('✅ Закрываем чек...');
    await this.fiscalRequest<void>('/CloseRec', {});
  }

  /**
   * Аннулировать последний чек
   */
  async voidReceipt(): Promise<void> {
    console.log('❌ Аннулируем чек...');
    await this.fiscalRequest<void>('/fiscal/bills/recVoid/', {});
  }

  /**
   * Создать чек одной командой openAndCloseRec (приход)
   */
  async openAndCloseRec(payload: unknown): Promise<void> {
    console.log('🧾 Вызываем openAndCloseRec с payload:', JSON.stringify(payload, null, 2));

    const result = await this.fiscalRequest<any>('/fiscal/bills/openAndCloseRec/', payload as any);

    console.log('✅ openAndCloseRec выполнен успешно, результат:', result);

    return result;
  }

  /**
   * Встроенная платёжная система NewCas: ExecutePayment
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

    console.log('💳 Вызываем executePayment с параметрами:', body);

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

      console.log('💳 Сырой ответ executePayment:', rawResult);

      // Если ответ пустой или undefined, считаем успешным
      if (!rawResult || rawResult === null) {
        console.log('💳 Пустой ответ, считаем платеж успешным');

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
      console.error('❌ Ошибка executePayment:', error);
      throw new FiscalError(
        FiscalStatus.INTERNAL_SERVICE_ERROR,
        `Ошибка выполнения платежа: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  // ===========================================
  // ВЫСОКОУРОВНЕВЫЕ МЕТОДЫ ДЛЯ ТАКСИ
  // ===========================================

  /**
   * Создать полный чек для поездки на такси
   * Основной метод для терминального приложения
   */
  async createTaxiReceipt(data: TaxiReceiptData): Promise<void> {
    console.log('🚕 Создаем чек для поездки на такси:', data);

    try {
      // 1. Проверяем состояние ФН
      const state = await this.getState();

      // Проверяем что запрос выполнен успешно (status === 0)
      // В реальном API нет полей isReady и isRegistered
      if (state.status !== undefined && state.status !== 0) {
        throw new FiscalError(
          FiscalStatus.FISCAL_CORE_ERROR,
          `Фискальный накопитель вернул ошибку: status=${state.status}`,
        );
      }

      // 2. Проверяем рабочую смену через dayState в состоянии
      // dayState: 0 = закрыта, 1 = открыта
      if (state.dayState === 0) {
        console.log('📅 Смена закрыта, открываем новую...');
        await this.openDay();

        // Проверяем еще раз после открытия
        const newState = await this.getState();

        if (newState.dayState !== 1) {
          throw new FiscalError(FiscalStatus.FISCAL_CORE_ERROR, 'Не удалось открыть рабочую смену');
        }
      } else if (state.dayState === 1) {
        // Проверяем не истекла ли смена (24 часа)
        if (state.isShiftExpired) {
          console.log('⏰ Смена истекла (более 24 часов), закрываем и открываем новую...');

          // Закрываем старую смену
          await this.closeDay();

          // Открываем новую смену
          await this.openDay();

          // Проверяем еще раз
          const newState = await this.getState();

          if (newState.dayState !== 1 || newState.isShiftExpired) {
            throw new FiscalError(FiscalStatus.FISCAL_CORE_ERROR, 'Не удалось переоткрыть смену');
          }

          console.log('✅ Смена успешно переоткрыта');
        } else {
          console.log('✅ Смена открыта и активна, продолжаем...');
        }
      } else {
        console.warn('⚠️ Неизвестное состояние смены:', state.dayState);
      }

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
            // payType убран - он есть в payItems
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

      console.log(
        '📄 Отправляем данные чека на openAndCloseRec:',
        JSON.stringify(receiptPayload, null, 2),
      );

      // Дополнительная проверка структуры
      console.log('🔍 Проверка goods[0]:', receiptPayload.goods[0]);
      console.log('🔍 Тип article:', typeof receiptPayload.goods[0].article);

      await this.openAndCloseRec(receiptPayload);

      console.log('✅ Чек для поездки на такси создан успешно');
    } catch (error) {
      console.error('❌ Ошибка создания чека для такси:', error);

      // Логируем детали ошибки
      if (error instanceof FiscalError) {
        console.error('Детали фискальной ошибки:', {
          status: error.status,
          message: error.message,
          extCode: error.details?.extCode,
          extCode2: error.details?.extCode2,
        });

        // Обрабатываем ошибку истечения смены
        if (error.message && error.message.includes('Смена не может превышать 24 часа')) {
          console.log('🔄 Обнаружена истекшая смена, пытаемся переоткрыть и повторить...');

          try {
            // Закрываем старую смену
            await this.closeDay();
            // Открываем новую
            await this.openDay();

            console.log('✅ Смена переоткрыта, повторяем создание чека...');

            // Рекурсивно вызываем себя же для повторной попытки
            return await this.createTaxiReceipt(data);
          } catch (reopenError) {
            console.error('❌ Не удалось переоткрыть смену:', reopenError);
            throw new FiscalError(
              FiscalStatus.FISCAL_CORE_ERROR,
              'Не удалось переоткрыть смену для создания чека',
            );
          }
        }
      }

      // Если это ошибка печати - документ уже создан, не пытаемся аннулировать
      if (error instanceof FiscalError && error.isPrintError) {
        console.warn('⚠️ Документ создан, но ошибка печати. Повторная печать может потребоваться.');
        throw error;
      }

      // НЕ АННУЛИРУЕМ ЧЕК АВТОМАТИЧЕСКИ!
      // Это может быть проблема с параметрами, а не с созданным чеком
      console.warn('⚠️ Не аннулируем чек автоматически. Возможно, он не был создан.');

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
   */
  async printRaster(rasterBase64: string): Promise<void> {
    console.log('🖨️ Печатаем растровое изображение...');

    try {
      await this.fiscalRequest<void>('/fiscal/bills/printRaster/', {
        raster: rasterBase64,
      });

      console.log('✅ Растровое изображение напечатано успешно');
    } catch (error) {
      console.error('❌ Ошибка печати растрового изображения:', error);
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
   */
  async printLine(line: string, align: number = 0): Promise<void> {
    try {
      await this.fiscalRequest<void>('/fiscal/bills/printLine/', {
        line,
        align,
      });
    } catch (error) {
      console.error('❌ Ошибка печати строки:', error);
      throw new FiscalError(
        FiscalStatus.PRINTER_ERROR,
        `Ошибка печати строки: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Печать чека такси построчно одним запросом
   * @param data - данные для печати чека
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
  }): Promise<void> {
    console.log('🔨️ Создаем текстовый чек для построчной печати:', data);

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
      console.log('🚀 Начинаем печать текстового чека ОДНИМ запросом');
      console.log('📄 Отправляем строки:', lines);
      
      // Отправляем все строки ОДНИМ запросом
      const textContent = lines.join('\n');
      console.log('📝 Объединенный текст для отправки:', textContent);
      
      const result = await this.fiscalRequest<void>('/fiscal/bills/printText/', {
        text: textContent,
        cutPaper: true // Отрезать бумагу после печати
      });
      
      console.log('✅ Текстовый чек успешно напечатан ОДНИМ запросом');
      console.log('📊 Результат:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Ошибка при печати текстового чека:', error);
      console.error('🔍 Детали ошибки:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined
      });
      throw error;
    }
  }


}

// Экспортируем экземпляр сервиса для использования в приложении
export const fiscalService = new FiscalService();

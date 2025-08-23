import type {
  FiscalStatus,
  TaxSystem,
  VATRate,
  NSPRate,
  CalcType,
  PayType,
  ReceiptType,
} from '../enums/fiscal-enums';

/**
 * Базовый ответ от фискального API
 */
export interface FiscalResponse<T = any> {
  status: FiscalStatus;
  extCode?: number;
  extCode2?: number;
  errorMessage: string;
  data?: T;
}

/**
 * Базовый запрос к фискальному API
 */
export interface BaseFiscalRequest {
  registrationNumber?: string; // Для множественных ФН
  fmNumber?: string; // Альтернативный ID ФН
  cacheId?: string; // Для кэширования запросов
}

/**
 * Состояние фискального накопителя (реальная структура из API)
 */
export interface FiscalState {
  status: number;
  extCode: number;
  extCode2: number;
  errorMessage: string;
  billNumber: number;
  cashSum: number;
  cashlessSum: number;
  dateTime: string;
  dayState: number;
  documentNumber: number;
  fmNumber: string;
  incomeSum: number;
  isShiftExpired: boolean;
  purchaseNumber: number;
  purchaseReturnNumber: number;
  purchaseReturnSum: number;
  purchaseSum: number;
  queueSize: number;
  registrationNumber: string;
  saleNumber: number;
  saleReturnNumber: number;
  saleReturnSum: number;
  saleSum: number;
  sectionCounters: any[];
  serialNumber: string;
  shiftDateTime: string;
  shiftNumber: number;
}

/**
 * Состояние рабочего дня/смены
 */
export interface DayState {
  isOpen: boolean;
  openDateTime?: string;
  shiftNumber: number;
  receiptsCount: number;
  totalSales: number;
  totalReturns: number;
}

/**
 * Элемент чека (товар/услуга)
 */
export interface ReceiptItem {
  name: string; // Наименование
  price: number; // Цена (не более 2 знаков после запятой)
  quantity: number; // Количество
  vatNum: VATRate; // Ставка НДС
  stNum: NSPRate; // Ставка НСП
  calcType: CalcType; // Признак предмета расчёта
  payType: PayType; // Признак способа расчёта
  department?: number; // Отдел (опционально)
  barcode?: string; // Штрихкод (опционально)
}

/**
 * Запрос на открытие чека
 */
export interface OpenReceiptRequest extends BaseFiscalRequest {
  recType: ReceiptType; // Тип чека
  taxSystem?: TaxSystem; // Налоговая система
}

/**
 * Запрос на добавление товара в чек
 */
export interface PrintReceiptItemRequest extends BaseFiscalRequest {
  name: string;
  price: number;
  quantity: number;
  vatNum: VATRate;
  stNum: NSPRate;
  calcType: CalcType;
  payType: PayType;
  department?: number;
  barcode?: string;
}

/**
 * Запрос на итог чека
 */
export interface PrintReceiptTotalRequest extends BaseFiscalRequest {
  total: number; // Общая сумма
  paymentType?: string; // Тип оплаты (наличные/безналичные)
}

/**
 * Запрос на закрытие чека
 */
export interface CloseReceiptRequest extends BaseFiscalRequest {
  // Дополнительные параметры при необходимости
}

/**
 * Данные для создания чека такси
 */
export interface TaxiReceiptData {
  price: number;
  route: string;
  paymentMethod: string;
  passengerName?: string;
  orderId?: string;
}

/**
 * Версия фискального ПО
 */
export interface FiscalVersion {
  version: string;
  buildDate: string;
  coreVersion: string;
}

/**
 * Статус регистрации ФН
 */
export interface RegistrationStatus {
  isRegistered: boolean;
  registrationNumber: string;
  inn: string;
  organizationName: string;
  registrationDate?: string;
}

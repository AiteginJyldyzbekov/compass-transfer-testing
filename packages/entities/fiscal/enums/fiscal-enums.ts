/**
 * Коды статусов ответов фискального API
 */
export enum FiscalStatus {
  SUCCESS = 0, // запрос отработал без ошибок
  UNKNOWN_COMMAND = 1, // неизвестная команда
  JSON_PARSE_ERROR = 2, // ошибка парсинга JSON
  JSON_SERIALIZATION_ERROR = 3, // ошибка сериализации JSON
  BINARY_SERIALIZATION_ERROR = 4, // ошибка бинарной сериализации
  INTERNAL_SERVICE_ERROR = 5, // внутренняя ошибка сервиса
  FISCAL_CORE_ERROR = 6, // ошибка фискального ядра
  INVALID_ARGUMENT = 7, // некорректный аргумент в запросе
  LICENSE_EXPIRED = 8, // лицензия ядра истекла или отсутствует
  PRINTER_ERROR = 9, // ошибка принтера
  PRINTER_BUSY = 10, // принтер занят
}

/**
 * Типы фискальных накопителей
 */
export enum FiscalNodeType {
  CLOUD = 4445, // облачный ФН
  SOFTWARE = 4446, // программный ФН
  SMARTCARD = 4447, // накопитель на смарт-карте
}

/**
 * Коды налоговых систем
 */
export enum TaxSystem {
  GENERAL = 0, // Общий налоговый режим
  MANDATORY_PATENT = 1, // Налог на основе обязательного патента
  PATENT = 2, // Налог на основе патента
  SIMPLIFIED_SINGLE = 3, // Упрощенная система налогообложения на основе единого налога
  TAX_CONTRACT = 4, // Налоги на основе налогового контракта
  FREE_ECONOMIC_ZONE = 5, // Налоговый режим в свободных экономических зонах
  HIGH_TECH_PARK = 6, // Налоговый режим в Парке высоких технологий
  SIMPLIFIED_RETAIL = 7, // Упрощенная система налогообложения на основе налога с розничных продаж
  MINING = 8, // Налог на майнинг
  E_COMMERCE = 9, // Налог на деятельность в сфере электронной торговли
}

/**
 * Коды для ставок НДС
 */
export enum VATRate {
  ZERO_PERCENT = 0, // 0%
  TWELVE_PERCENT = 1, // 12%
}

/**
 * Коды для ставок НСП (налог с продаж)
 */
export enum NSPRate {
  ZERO_PERCENT = 0, // 0%
  ONE_PERCENT = 1, // 1%
  TWO_PERCENT = 2, // 2%
  THREE_PERCENT = 3, // 3%
  FIVE_PERCENT = 4, // 5%
}

/**
 * Коды признаков предмета расчёта
 */
export enum CalcType {
  GOODS = 0, // Товар
  SERVICES = 1, // Услуги или работы
  BANK_PRODUCT = 2, // Предмет расчета, реализуемый банком
  MOBILE_SERVICES = 3, // Услуги сотовой связи
  CASH_WITHDRAWAL = 4, // Выплата денежных средств
  ADVANCE_PAYMENT = 5, // Авансовый платеж
  CURRENCY_EXCHANGE = 6, // Обмен иностранной валюты, реализуемый обменным бюро
  NON_TAXABLE_SUPPLIES = 7, // Необлагаемые поставки
  CREDIT_PAYMENT = 8, // Кредитный платеж
  STATE_FEE = 9, // Государственная пошлина
}

/**
 * Коды признаков способа расчёта
 */
export enum PayType {
  FULL_PAYMENT = 0, // полный расчёт
  PREPAYMENT = 1, // предоплата
  PARTIAL_PAYMENT = 2, // частичный расчёт
  CREDIT = 3, // кредит
  POSTPAYMENT = 4, // постоплата
}

/**
 * Типы чеков
 */
export enum ReceiptType {
  SALE = 0, // Продажа
  RETURN = 1, // Возврат
  DEPOSIT = 2, // Внесение
  WITHDRAWAL = 3, // Изъятие
}

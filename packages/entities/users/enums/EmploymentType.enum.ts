/**
 * `Percentage` = Процентная оплата<br>`FixedAmount` = Фиксированная оплата
 * @enum
 */
export enum EmploymentType {
  Percentage = 'Percentage',
  FixedAmount = 'Fixed',
}

/**
 * Массив всех значений EmploymentType
 */
export const EmploymentTypeValues = [
  EmploymentType.Percentage,
  EmploymentType.FixedAmount,
];

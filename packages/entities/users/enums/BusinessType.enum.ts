/**
 * `Individual` = Индивидуальный предприниматель<br>`LLC` = ООО<br>`Corporation` = Корпорация<br>`Partnership` = Товарищество<br>`Cooperative` = Кооператив<br>`NonProfit` = Некоммерческая организация<br>`GovernmentEntity` = Государственная организация
 * @enum
 */
export enum BusinessType {
  Individual = 'Individual',
  LLC = 'LLC',
  Corporation = 'Corporation',
  Partnership = 'Partnership',
  Cooperative = 'Cooperative',
  NonProfit = 'NonProfit',
  GovernmentEntity = 'GovernmentEntity'
}
/**
 * Массив всех значений BusinessType
 */
export const BusinessTypeValues = [
  BusinessType.Individual,
  BusinessType.LLC,
  BusinessType.Corporation,
  BusinessType.Partnership,
  BusinessType.Cooperative,
  BusinessType.NonProfit,
  BusinessType.GovernmentEntity
];
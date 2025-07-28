/**
 * `Unknown` = Не задан<br>`Customer` = Клиент<br>`Admin` = Администратор<br>`Driver` = Водитель<br>`Operator` = Оператор<br>`Partner` = Партнер<br>`Terminal` = Терминал
 * @enum
 */
export enum Role {
  Unknown = 'Unknown',
  Customer = 'Customer',
  Admin = 'Admin',
  Driver = 'Driver',
  Operator = 'Operator',
  Partner = 'Partner',
  Terminal = 'Terminal',
}
/**
 * Массив всех значений Role
 */
export const RoleValues = [
  Role.Unknown,
  Role.Customer,
  Role.Admin,
  Role.Driver,
  Role.Operator,
  Role.Partner,
  Role.Terminal,
];

/**
 * `Black` = Черный<br>`White` = Белый<br>`Silver` = Серебристый<br>`Gray` = Серый<br>`Red` = Красный<br>`Blue` = Синий<br>`Green` = Зеленый<br>`Yellow` = Желтый<br>`Brown` = Коричневый<br>`Orange` = Оранжевый<br>`Purple` = Фиолетовый<br>`Gold` = Золотой<br>`Other` = Другой
 * @enum
 */
export enum CarColor {
  Black = 'Black',
  White = 'White',
  Silver = 'Silver',
  Gray = 'Gray',
  Red = 'Red',
  Blue = 'Blue',
  Green = 'Green',
  Yellow = 'Yellow',
  Brown = 'Brown',
  Orange = 'Orange',
  Purple = 'Purple',
  Gold = 'Gold',
  Other = 'Other',
}
/**
 * Массив всех значений CarColor
 */
export const CarColorValues = [
  CarColor.Black,
  CarColor.White,
  CarColor.Silver,
  CarColor.Gray,
  CarColor.Red,
  CarColor.Blue,
  CarColor.Green,
  CarColor.Yellow,
  CarColor.Brown,
  CarColor.Orange,
  CarColor.Purple,
  CarColor.Gold,
  CarColor.Other,
];

/**
 * Переводы цветов автомобилей
 */
export const CarColorTranslations = {
  [CarColor.Black]: 'Чёрный',
  [CarColor.White]: 'Белый',
  [CarColor.Silver]: 'Серебристый',
  [CarColor.Gray]: 'Серый',
  [CarColor.Red]: 'Красный',
  [CarColor.Blue]: 'Синий',
  [CarColor.Green]: 'Зелёный',
  [CarColor.Yellow]: 'Жёлтый',
  [CarColor.Brown]: 'Коричневый',
  [CarColor.Orange]: 'Оранжевый',
  [CarColor.Purple]: 'Фиолетовый',
  [CarColor.Gold]: 'Золотой',
  [CarColor.Other]: 'Другой',
} as const;

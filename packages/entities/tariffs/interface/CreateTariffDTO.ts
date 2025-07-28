import type { TariffBaseDTO } from './TariffBaseDTO';

/**
 * Интерфейс для создания тарифа
 * @interface
 */
export interface CreateTariffDTO extends Omit<TariffBaseDTO, 'id'> {
  // Дополнительные поля для создания, если нужны
}

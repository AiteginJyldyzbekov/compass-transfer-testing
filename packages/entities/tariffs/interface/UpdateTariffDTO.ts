import type { TariffBaseDTO } from './TariffBaseDTO';

/**
 * Интерфейс для обновления тарифа
 * @interface
 */
export interface UpdateTariffDTO extends Partial<Omit<TariffBaseDTO, 'id'>> {
  // Все поля опциональны для обновления
}

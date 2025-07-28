import type { LocationBaseDTO } from '@entities/locations/interface/LocationBaseDTO';

/**
 * Интерфейс для получения полной информации о локации с уникальным идентификатором
 * @interface GetLocationDTO
 */
export interface GetLocationDTO extends LocationBaseDTO {
  id: string;
}

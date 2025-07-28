/**
 * Интерфейс GetServiceDTO
 * @interface
 */
export interface GetServiceDTO {
  name: string;
  description?: string | null;
  price: number;
  isQuantifiable: boolean;
  id: string;
}
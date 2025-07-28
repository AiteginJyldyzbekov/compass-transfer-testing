/**
 * Интерфейс ServiceDTO
 * @interface
 */
export interface ServiceDTO {
  name: string;
  description?: string | null;
  price: number;
  isQuantifiable: boolean;
}
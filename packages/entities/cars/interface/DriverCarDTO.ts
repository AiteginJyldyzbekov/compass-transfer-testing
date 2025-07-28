/**
 * Интерфейс для связи водителя с автомобилем
 * @interface DriverCarDTO
 */
export interface DriverCarDTO {
  driverId: string;
  carId: string;
  isActive: boolean;
  assignedAt: string;
}

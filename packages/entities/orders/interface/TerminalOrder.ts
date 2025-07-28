export interface TerminalOrder {
  locations?: LocationWithCoordinates[];
  startLocation?: LocationWithCoordinates;
  tariff?: Tariff | null;
  finalPrice?: number;
}

interface LocationWithCoordinates {
  name: string;
  address: string;
  id: string;
  latitude: number;
  longitude: number;
}

interface Tariff {
  id: string;
  name: string;
  minutePrice: number;
  basePrice: number;
  minimumPrice: number;
  perKmPrice: number; // Добавляем цену за километр
  occupancy: number;
}

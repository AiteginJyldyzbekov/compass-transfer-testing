export interface ReceiptType {
  data: Data;
  id: string;
  type: string;
  title: string;
  content: null;
  orderId: string;
  orderType: string;
  rideId: string;
}

interface Data {
  driver: Driver;
  car: Car;
}

interface Car {
  id: string;
  model: string;
  color: string;
  licensePlate: string;
}

interface Driver {
  id: string;
  fullName: string;
  rating: number;
}

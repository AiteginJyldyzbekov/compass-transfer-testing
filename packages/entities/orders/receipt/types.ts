export interface OrderReceiptDTO {
  data: ReceiptData;
  id: string;
  type: string;
  title: string;
  content: null;
  orderId: string;
  orderType: string;
  rideId: string;
}

interface ReceiptData {
  driver: ReceiptDriver;
  car: ReceiptCar;
  orderNumber?: string;
  queueNumber?: string;
}

interface ReceiptCar {
  id: string;
  make?: string;
  model: string;
  color: string;
  licensePlate: string;
}

interface ReceiptDriver {
  id: string;
  fullName: string;
  phoneNumber?: string;
  rating: number;
}

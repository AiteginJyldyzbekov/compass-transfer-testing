export interface Notification {
  id: number;
  type: 'order' | 'payment' | 'system' | 'support' | 'deleted';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  deletedAt?: Date;
}

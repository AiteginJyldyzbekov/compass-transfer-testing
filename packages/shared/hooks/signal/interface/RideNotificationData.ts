export interface RideNotificationData {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  type: 'request' | 'accepted' | 'assigned' | 'cancelled' | 'completed';
}

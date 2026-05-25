import { NotificationStatus } from './enums';

export interface NotificationCreateRequest {
  userId: number;
  applicantId: number;
  message: string;
  category: string;
}
export interface NotificationItem {
  notificationId: number;
  userId: number;
  applicationId: number;
  message: string;
  category: string;
  status: NotificationStatus | number;
  createdDate: string;
}

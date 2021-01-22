export class Notification {
  read: boolean;
  notificationType: NotificationType;
  message: string;
  userId: string;
}

export enum NotificationType {
  Info = 'info',
  Err = 'err',
  Warning = 'warn',
}

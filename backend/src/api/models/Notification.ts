import mongoose, { Types } from 'mongoose';

export type NotificationDocument = mongoose.Document & {
    read: boolean;
    notificationType: NotificationType;
    message: string;
    userId: Types.ObjectId;
};

export enum NotificationType {
    Info = 'info',
    Err = 'err',
    Warning = 'warn',
}

const notificationSchema = new mongoose.Schema(
    {
        read: { type: Boolean, required: true },
        notificationType: { type: String, enum: ['err', 'info', 'warn'], required: true },
        message: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    },
    { timestamps: true },
);

export const Notification = mongoose.model<NotificationDocument>('Notification', notificationSchema);

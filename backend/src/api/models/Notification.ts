import mongoose, { Types } from 'mongoose';
import {nanoid} from 'nanoid';

export type NotificationDocument = mongoose.Document & {
    ref: string;
    timestamp: Date;
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
        ref: {type: String, unique: true, default: () => nanoid()},
        read: { type: Boolean, required: true },
        notificationType: { type: String, enum: ['err', 'info', 'warn'], required: true },
        message: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', get: v => v.toString()},
    },
    { timestamps: true },
);

export const Notification = mongoose.model<NotificationDocument>('Notification', notificationSchema);

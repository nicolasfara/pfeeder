import mongoose, {Types} from "mongoose";

export type NotificationDocument = mongoose.Document & {
    timestamp: Date;
    read: boolean;
    notificationType: NotificationType;
    message: string;
    userId: Types.ObjectId;
}

export enum NotificationType {
    Info = "info",
    Err = "err",
    Warning = "warn"
}

const notificationSchema = new mongoose.Schema({
    timestamp: Date,
    read: Boolean,
    notificationType: {type: String, enum: ["err", "info", "warn"]},
    message: String,
    userId: mongoose.Types.ObjectId
}, { timestamps: true });

export const Notification = mongoose.model<NotificationDocument>("Notification", notificationSchema);

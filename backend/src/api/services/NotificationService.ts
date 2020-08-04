import {Service} from "typedi";
import {UserDocument} from "../models/User";
import {Notification, NotificationDocument} from "../models/Notification";
import {CreateNotification} from "../controllers/requests/NotificationRequests";

@Service()
export class NotificationService {

    public async getAllUserNotifications(user: UserDocument): Promise<NotificationDocument[]> {
        try {
            return await Notification.find({ userId: user.id }).lean()
        } catch (e) {
            throw new Error(e)
        }
    }

    public async createNewNotification(user: UserDocument, body: CreateNotification): Promise<NotificationDocument> {
        try {
            const notification = new Notification({
                timestamp: body.timestamp,
                read: false,
                notificationType: body.notificationType,
                message: body.message,
                userId: user.id
            })
            const createdNotification = await notification.save()
            return createdNotification.toObject()
        } catch (e) {
            throw new Error(e)
        }
    }

    public async readNotification(user: UserDocument, notificationId: string): Promise<NotificationDocument> {
        try {
            return await Notification.findOneAndUpdate({ _id: notificationId, userId: user.id }, { read: true }).lean()
        } catch (e) {
            throw new Error(e)
        }
    }
}
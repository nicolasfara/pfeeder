import {Service} from "typedi";
import NotificationRepository from "../repository/NotificationRepository";
import {GeneralMessage, MessageStatus} from "./MessageInterface";
import UserRepository from "../repository/UserRepository";
import {Notification, NotificationType} from "../models/Notification";
import {Types} from "mongoose";

@Service()
export class MqttService {
    constructor(
        private notificationRepository: NotificationRepository,
        private userRepository: UserRepository
    ) { }

    public async addInfoNotification(message: Buffer): Promise<boolean> {
        const parsedMessage: GeneralMessage = JSON.parse(message.toString())
        const user = await this.userRepository.findOne({ apiKeys: parsedMessage.deviceId })
        if (user) {
            const notification = new Notification()
            notification.read = false
            notification.notificationType = NotificationType.Info
            notification.message = parsedMessage.message
            notification.userId = Types.ObjectId(user._id)
            const savedNot = await this.notificationRepository.create(notification)
            return !!savedNot
        } else return false
    }

    public async addAlertNotification(message: Buffer): Promise<boolean> {
        const parsedMessage: GeneralMessage = JSON.parse(message.toString())
        const user = await this.userRepository.findOne({ apiKeys: parsedMessage.deviceId})
        if (user) {
            const notification = new Notification()
            notification.read = false
            notification.notificationType = NotificationType.Warning
            notification.message = parsedMessage.message
            notification.userId = Types.ObjectId(user._id)
            const savedNot = await this.notificationRepository.create(notification)
            return !!savedNot
        } else return false
    }

    public async addStatusNotification(message: Buffer): Promise<boolean> {
        const parsedMessage: MessageStatus = JSON.parse(message.toString())
        const user = await this.userRepository.findOne({ apiKeys: parsedMessage.deviceId})
        if (user) {
            const notification = new Notification()
            notification.read = false
            notification.notificationType = NotificationType.Info
            notification.message = `Supply of ${parsedMessage.ration} g`
            notification.userId = Types.ObjectId(user._id)
            const savedNot = await this.notificationRepository.create(notification)
            return !!savedNot
        } else return false
    }
}
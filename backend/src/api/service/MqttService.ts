import {Service} from "typedi";
import NotificationRepository from "../repository/NotificationRepository";
import {FeedMessage, GeneralMessage, MessageStatus} from "./MessageInterface";
import UserRepository from "../repository/UserRepository";
import {Notification, NotificationDocument, NotificationType} from "../models/Notification";
import {Types} from "mongoose";
import {redisClient} from "../../loaders/redisLoader";
import {ws} from "../../loaders/socketLoader";
import {LoggerInterface} from "../../lib/logger";
import {Logger} from "../../decorators/Logger";
import {UserDocument} from "../models/User";
import {Feed} from "../models/Feed";
import FeedRepository from "../repository/FeedRepository";
import PetRepository from "../repository/PetRepository";

@Service()
export class MqttService {
    constructor(
        private notificationRepository: NotificationRepository,
        private feedRepository: FeedRepository,
        private petRepository: PetRepository,
        private userRepository: UserRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async addFeed(message: Buffer): Promise<boolean> {
        let parsedMessage: FeedMessage
        try {
            parsedMessage = JSON.parse(message.toString())
        } catch (e) {
            this.log.error(e)
            return false
        }
        const user = await this.userRepository.findOne({ apiKeys: parsedMessage.deviceId })
        if (user) {
            const feed = new Feed()
            feed.quantity = parsedMessage.quantity
            feed.kcal = parsedMessage.kcal
            feed.fodderId = Types.ObjectId(parsedMessage.fodderId)
            const petId = await this.petRepository.findOne({ name: parsedMessage.petName })
            if (!petId) return false
            feed.petId = petId._id
            const savedFeed = await this.feedRepository.create(feed)
            return !!savedFeed
        } else return false
    }

    public async addInfoNotification(message: Buffer): Promise<boolean> {
        let parsedMessage: GeneralMessage
        try {
            parsedMessage = JSON.parse(message.toString())
        } catch (e) {
            this.log.error(e)
            return false
        }
        const user = await this.userRepository.findOne({ apiKeys: parsedMessage.deviceId })
        if (user) {
            const notification = new Notification()
            notification.read = false
            notification.notificationType = NotificationType.Info
            notification.message = parsedMessage.message
            notification.userId = Types.ObjectId(user._id)
            const savedNot = await this.notificationRepository.create(notification)
            if (savedNot) {
                await this.emitOnWebSocket(user, notification)
            }
            return !!savedNot
        } else return false
    }

    public async addAlertNotification(message: Buffer): Promise<boolean> {
        let parsedMessage: GeneralMessage
        try {
            parsedMessage = JSON.parse(message.toString())
        } catch (e) {
            this.log.error(e)
            return false
        }
        const user = await this.userRepository.findOne({ apiKeys: parsedMessage.deviceId})
        if (user) {
            const notification = new Notification()
            notification.read = false
            notification.notificationType = NotificationType.Warning
            notification.message = parsedMessage.message
            notification.userId = Types.ObjectId(user._id)
            const savedNot = await this.notificationRepository.create(notification)
            if (savedNot) {
                await this.emitOnWebSocket(user, notification)
            }
            return !!savedNot
        } else return false
    }

    public async addStatusNotification(message: Buffer): Promise<boolean> {
        let parsedMessage: MessageStatus
        try {
            parsedMessage = JSON.parse(message.toString())
        } catch (e) {
            this.log.error(e)
            return false
        }
        const user = await this.userRepository.findOne({ apiKeys: parsedMessage.deviceId})
        if (user) {
            const notification = new Notification()
            notification.read = false
            notification.notificationType = NotificationType.Info
            notification.message = `Supply of ${parsedMessage.ration} g`
            notification.userId = Types.ObjectId(user._id)
            const savedNot = await this.notificationRepository.create(notification)
            if (savedNot) {
                await this.emitOnWebSocket(user, notification)
            }
            return !!savedNot
        } else return false
    }

    private async emitOnWebSocket(user: UserDocument, notification: NotificationDocument): Promise<void> {
        redisClient.smembers(user.email, (err, values: string[]) => {
            values.forEach(socketId => {
                this.log.info(`Emit on ws: ${socketId}`)
                ws.to(socketId).emit('notifications', notification)
            })
        })
    }
}

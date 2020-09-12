import {Authorized, Body, CurrentUser, Get, JsonController, Patch, Post} from "routing-controllers";
import {UserDocument} from "../models/User";
import {OpenAPI} from "routing-controllers-openapi";
import {CreateNotification, ReadNotification} from "./requests/NotificationRequests";
import {NotificationDocument, Notification, NotificationType} from "../models/Notification";
import NotificationRepository from "../repository/NotificationRepository";
import {Types} from "mongoose";

@JsonController('/notifications')
export class NotificationController {

    constructor(
        private notificationRepository: NotificationRepository
    ) {
    }

    @Get()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async getAllNotification(
        @CurrentUser() user: UserDocument
    ): Promise<NotificationDocument[]> {
        return this.notificationRepository.findMany({ userId: user.id })
    }

    @Post()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }] })
    public async createNotification(@CurrentUser() user: UserDocument, @Body() body: CreateNotification) {
        const notification = new Notification()
        notification.userId = user.id
        notification.message = body.message
        notification.notificationType = body.notificationType as NotificationType
        notification.timestamp = body.timestamp
        return this.notificationRepository.create(notification)
    }

    @Patch()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }] })
    public async readNotification(@CurrentUser() user: UserDocument, @Body() body: ReadNotification) {
        const notification = await this.notificationRepository.findOne({ _id: body.notificationId })
        notification.read = true
        return this.notificationRepository.update(Types.ObjectId(body.notificationId), notification)
    }
}

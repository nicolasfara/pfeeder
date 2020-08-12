import {Authorized, Body, CurrentUser, Get, HttpError, JsonController, Patch, Post} from "routing-controllers/index";
import {UserDocument} from "../models/User";
import {OpenAPI} from "routing-controllers-openapi";
import {CreateNotification, ReadNotification} from "./requests/NotificationRequests";
import {NotificationDocument} from "../models/Notification";
import {NotificationService} from "../services/NotificationService";

@JsonController('/notifications')
export class NotificationController {

    constructor(
        private notificationService: NotificationService
    ) {
    }

    @Get()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async getAllNotification(
        @CurrentUser() user: UserDocument
    ): Promise<NotificationDocument[]> {
        try {
            return await this.notificationService.getAllUserNotifications(user)
        } catch (e) {
            throw new HttpError(500, e.message)
        }
    }

    @Post()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }] })
    public async createNotification(@CurrentUser() user: UserDocument, @Body() body: CreateNotification) {
        try {
            return await this.notificationService.createNewNotification(user, body)
        } catch (e) {
            throw new HttpError(500, e.message)
        }
    }

    @Patch()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }] })
    public async readNotification(@CurrentUser() user: UserDocument, @Body() body: ReadNotification) {
        try {
            return await this.notificationService.readNotification(user, body.notificationId)
        } catch (e) {
            throw new HttpError(500, e.message)
        }
    }
}

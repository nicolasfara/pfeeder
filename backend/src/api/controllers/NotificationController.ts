import {Authorized, CurrentUser, JsonController, Patch, Post} from "routing-controllers/index";
import {UserDocument} from "../models/User";
import {OpenAPI} from "routing-controllers-openapi";

@JsonController('/notifications')
export class NotificationController {

    @Post()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }] })
    public async createNotification(@CurrentUser() user: UserDocument) {

    }

    @Patch()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }] })
    public async readNotification(@CurrentUser() user: UserDocument) {

    }
}

import {Authorized, CurrentUser, JsonController, Post} from "routing-controllers/index";
import {OpenAPI} from "routing-controllers-openapi";
import {UserDocument} from "../models/User";

@JsonController('/feeds')
export class FeedController {
    @Post()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }] })
    public async addFeed(@CurrentUser() user: UserDocument) {

    }
}

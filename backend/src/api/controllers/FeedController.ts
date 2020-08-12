import {Authorized, Body, CurrentUser, Get, HttpError, JsonController, Post} from "routing-controllers/index";
import {OpenAPI} from "routing-controllers-openapi";
import {UserDocument} from "../models/User";
import {FeedService} from "../services/FeedService";
import {CreateFeed} from "./requests/FeedRequests";
import {FeedDocument} from "../models/Feed";

@JsonController('/feeds')
export class FeedController {

    constructor(
        private feedService: FeedService
    ) { }

    @Post()
    @Authorized('user')
    @OpenAPI({ security: [{ bearerAuth: [] }] })
    public async addFeed(@CurrentUser() user: UserDocument, @Body() body: CreateFeed) {
        try {
            return await this.feedService.addNewFeed(user, body)
        } catch (e) {
            throw new HttpError(500, e.message)
        }
    }

    @Get()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }] })
    public async getFeedsForUser(@CurrentUser() user: UserDocument): Promise<FeedDocument[]> {
        try {
            return this.feedService.getAllFeedsByUser(user)
        } catch (e) {
            throw new HttpError(500, e.message)
        }
    }
}

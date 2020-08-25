import {
    Authorized,
    Body,
    CurrentUser,
    Get,
    HttpError,
    JsonController,
    Param,
    Post,
    QueryParam
} from "routing-controllers/index";
import {OpenAPI} from "routing-controllers-openapi";
import {UserDocument} from "../models/User";
import {FeedService} from "../services/FeedService";
import {CreateFeed} from "./requests/FeedRequests";
import {FeedDocument} from "../models/Feed";
import {Logger, LoggerInterface} from "../../decorators/Logger";

@JsonController('/feeds')
export class FeedController {

    constructor(
        private feedService: FeedService,
        @Logger(__filename) private log: LoggerInterface
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

    @Get('/:pet_id')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }] })
    public async getFeedsByPet(
        @CurrentUser() user: UserDocument,
        @Param('pet_id') pet_id: string,
        @QueryParam('days') days: number
    ): Promise<FeedDocument[]> {
        try {
            if (days) {
                this.log.info("With days")
                return this.feedService.getAllFeedsByPetByDays(pet_id, days)
            } else {
                return this.feedService.getAllFeedsByPet(pet_id)
            }
        } catch (e) {
            throw new HttpError(500, e.message)
        }
    }
}

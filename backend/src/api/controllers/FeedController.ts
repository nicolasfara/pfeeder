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
} from "routing-controllers";
import {OpenAPI} from "routing-controllers-openapi";
import {UserDocument} from "../models/User";
import {CreateFeed} from "./requests/FeedRequests";
import {FeedDocument} from "../models/Feed";
import FeedRepository from "../repository/FeedRepository";
import {Types} from "mongoose";

@JsonController('/feeds')
export class FeedController {

    constructor(
        private feedRepository: FeedRepository,
        // @Logger(__filename) private log: LoggerInterface
    ) { }

    @Post()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }] })
    public async addFeed(@CurrentUser() user: UserDocument, @Body() body: CreateFeed) {
        return this.feedRepository.addNewFeed(Types.ObjectId(body.petId), body.ration, body.kcal, Types.ObjectId(body.fodderId))
    }

    @Get('/:petId')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }] })
    public async getFeedsByPet(
        @CurrentUser() user: UserDocument,
        @Param('petId') petId: string,
        @QueryParam('days') days: number
    ): Promise<FeedDocument[]> {
        return this.feedRepository.getFeedsByPetInDays(Types.ObjectId(petId), days)
    }

    @Get('/:petId/cost')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async getCostByPet(
        @CurrentUser() user: UserDocument,
        @Param('petId') petId: string,
        @QueryParam('days') days: number
    ): Promise<number> {
        const petFeeds: any = await this.feedRepository.getFeedsByPetInDays(Types.ObjectId(petId), days)
        if (petFeeds.length > 0) {
            return petFeeds.map(e => e.fodderId.price).reduce((acc, curr) => acc + curr)
        } else {
            throw new HttpError(402, `Unable to find feeds for this pet`)
        }
    }
}

import {Service} from "typedi";
import {UserDocument} from "../models/User";
import {CreateFeed} from "../controllers/requests/FeedRequests";
import {FeedDocument, Feed} from "../models/Feed";
import {PetService} from "./PetService";
import {FodderService} from "./FodderService";
import {Logger, LoggerInterface} from "../../decorators/Logger";
import {Types} from "mongoose";

@Service()
export class FeedService {

    constructor(
        private petService: PetService,
        private fodderService: FodderService,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async addNewFeed(user: UserDocument, body: CreateFeed): Promise<FeedDocument> {
        try {
            const petInfo = await this.petService.getPetById(user, body.petId)
            this.log.info(`pet: ${petInfo._id}`)
            const fodder = await this.fodderService.getFodderById(petInfo.currentFodder)
            this.log.info(`fodder: ${fodder.nutritionFacts}`)
            if (petInfo && fodder) {
                const feed = new Feed()
                feed.quantity = body.ration
                feed.kcal = fodder.nutritionFacts.kcal * body.ration/100
                feed.fodderId = petInfo.currentFodder
                feed.petId = Types.ObjectId(body.petId)
                const savedFeed = await feed.save()
                this.log.info(`saved: ${savedFeed}`)
                return savedFeed.toObject()
            }
        } catch (e) {
            throw new Error(e)
        }
        throw new Error('Unable to find pet for the user')
    }

    public async getAllFeedsByUser(user: UserDocument): Promise<FeedDocument[]> {
        try {
            const userPets = await this.petService.getPetsByUser(user);
            if (userPets) {
                const petsId = userPets.map(p => { return p._id })
                return await Feed.find({ _id: { $in: petsId }}).lean()
            }
        } catch (e) {
            throw new Error(e)
        }
        throw new Error(`Unable to find pets for the given user`)
    }

    public async getAllFeedsByPetByDays(petId: string, days: number): Promise<FeedDocument[]> {
        try {
            const delta = new Date().getDate() - days
            const date = new Date()
            date.setDate(delta)
            return await Feed.find({ petId: petId })
                .where('createdAt')
                .gt(date)
                .populate("fodderId")
                .lean()
        } catch (e) {
            throw new Error(e.message)
        }
    }

    public async getAllFeedsByPet(petId: string): Promise<FeedDocument[]> {
        try {
            return await Feed.find({ petId: petId }).populate("fodderId").lean()
        } catch (e) {
            throw new Error(e.message)
        }
    }
}

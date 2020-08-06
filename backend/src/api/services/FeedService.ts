import {Service} from "typedi";
import {UserDocument} from "../models/User";
import {CreateFeed} from "../controllers/requests/FeedRequests";
import {FeedDocument, Feed} from "../models/Feed";
import {PetService} from "./PetService";
import {FodderService} from "./FodderService";

@Service()
export class FeedService {

    constructor(
        private petService: PetService,
        private fodderService: FodderService,
    ) {
    }

    public async addNewFeed(user: UserDocument, body: CreateFeed): Promise<FeedDocument> {
        try {
            const petInfo = await this.petService.getPetById(user, body.petId)
            const fodder = await this.fodderService.getFodderById(petInfo.currentFodder)
            if (petInfo && fodder) {
                const feed = new Feed({
                    date: body.data,
                    quantity: body.ration,
                    kcal: fodder.nutritionFacts.kcal * body.ration/100,
                    fodderId: fodder.id,
                    userId: user.id
                })
                const savedFeed = await feed.save()
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
}
import {BaseRepository} from "./base/BaseRepository";
import {Feed, FeedDocument} from "../models/Feed";
import {Types} from "mongoose";
import {Service} from "typedi";

@Service()
class FeedRepository extends BaseRepository<FeedDocument> {
    constructor() {
        super(Feed);
    }

    async getFeedsByPetInDays(petId: Types.ObjectId, days?: number): Promise<FeedDocument[]> {
        const delta = new Date().getDate() - days
        const date = new Date()
        date.setDate(delta)
        if (days) {
            return this._model.find({petId})
                .where('createdAt')
                .gt(date)
                .populate("fodderId")
        } else {
            return this._model.find({ petId }).populate("fodderId")
        }
    }
}

Object.seal(FeedRepository)
export = FeedRepository
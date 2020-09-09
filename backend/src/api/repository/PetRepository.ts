import {BaseRepository} from "./base/BaseRepository";
import {Pet, PetDocument} from "../models/Pet";
import {Service} from "typedi";
import {Types} from "mongoose";

@Service()
class PetRepository extends BaseRepository<PetDocument> {
    constructor() {
        super(Pet);
    }

    async addFodderToPet(petId: Types.ObjectId, userId: Types.ObjectId, fodder: Types.ObjectId): Promise<PetDocument> {
        return this._model.findOneAndUpdate({ _id: petId, userId }, { currentFodder: fodder }).lean()
    }

    async getFodderFromPet(petId: Types.ObjectId, userId: Types.ObjectId): Promise<PetDocument> {
        return this._model.findOne({ _id: petId, userId }, "currentFodder").populate("currentFodder").lean()
    }

    async updateFodderForPet(petId: Types.ObjectId, userId: Types.ObjectId, currentFodder: Types.ObjectId): Promise<PetDocument> {
        return this._model.findOneAndUpdate({_id: petId, userId}, {currentFodder}).lean()
    }
}
Object.seal(PetRepository)
export = PetRepository
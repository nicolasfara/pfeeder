import {Service} from "typedi";
import {UserDocument} from "../models/User";
import {Pet, PetDocument} from "../models/Pet";
import {UpdateRation} from "../controllers/requests/PetRequests";
import {Types} from "mongoose";

@Service()
export class PetService {
    public async getPetsByUser(user: UserDocument): Promise<PetDocument[]> {
        try {
            return await Pet.find({userId: user.id}).lean();
        } catch (e) {
            throw new Error(e);
        }
    }

    public async getAllPets(): Promise<PetDocument[]> {
        try {
            return await Pet.find({}).lean();
        } catch (e) {
            throw new Error(e);
        }
    }

    public async getPetById(user: UserDocument, petId: string): Promise<PetDocument> {
        try {
            return await Pet.findOne({ _id: petId, userId: user.id }).lean();
        } catch (e) {
            throw new Error(e);
        }
    }

    public async patchPetById(user: UserDocument, petId: string, body: any): Promise<PetDocument> {
        try {
            return await Pet.findOneAndUpdate({ _id: petId, userId: user.id }, body).lean()
        } catch (e) {
            throw new Error(e);
        }
    }

    public async deletePetById(user: UserDocument, petId: string): Promise<PetDocument> {
        try {
            return await Pet.findOneAndDelete({ _id: petId, userId: user.id }).lean()
        } catch (e) {
            throw new Error(e);
        }
    }

    public async addRation(user: UserDocument, petId: string, ration: any): Promise<PetDocument> {
        try {
            return await Pet.findOneAndUpdate({ _id: petId, userId: user.id}, { $push: { rationPerDay: ration }}).lean()
        } catch (e) {
            throw new Error(e)
        }
    }

    public async getAllRations(user: UserDocument, petId: string): Promise<PetDocument> {
        try {
            return await Pet.findOne({ _id: petId, userId: user.id}, 'rationPerDay').lean()
        } catch (e) {
            throw new Error(e)
        }
    }

    public async updateRationByName(user: UserDocument, petId: string, rationName: string, updateRation: UpdateRation): Promise<PetDocument> {
        try {
            return await Pet.findOneAndUpdate({_id: petId, userId: user.id, 'rationPerDay.name': rationName}, {
                $set:
                    {
                        'rationPerDay.$.name': updateRation.name,
                        'rationPerDay.$.time': updateRation.time,
                        'rationPerDay.$.ration': updateRation.ration,
                    }
            }).lean()
        } catch (e) {
            throw new Error(e)
        }
    }

    public async deleteRationByName(user: UserDocument, petId: string, rationName: string): Promise<PetDocument> {
        try {
            return await Pet.findOneAndUpdate({ _id: petId, userId: user.id, 'rationPerDay.name': rationName}, {
                $pull: {
                    'rationPerDay.name': rationName
                }
            }).lean()
        } catch (e) {
            throw new Error(e)
        }
    }

    public async addFodderToPet(user: UserDocument, petId: string, fodderId: string): Promise<PetDocument> {
        try {
            return await Pet.findOneAndUpdate({ _id: petId, userId: user.id }, { currentFodder: Types.ObjectId(fodderId) }).lean()
        } catch (e) {
            throw new Error(e)
        }
    }
}

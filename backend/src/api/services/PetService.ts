import {Service} from "typedi";
import {UserDocument} from "../models/User";
import {Pet, PetDocument, PetType} from "../models/Pet";
import {AddRation, CreatePet, UpdateRation} from "../controllers/requests/PetRequests";
import {Types} from "mongoose";
import {FodderService} from "./FodderService";

@Service()
export class PetService {

    constructor(
        private fodderService: FodderService
    ) {
    }

    public async getPetsByUser(user: UserDocument): Promise<PetDocument[]> {
        try {
            return await Pet.find({userId: user.id}).lean();
        } catch (e) {
            throw new Error(e);
        }
    }

    public async createNewPet(user: UserDocument, body: CreatePet): Promise<PetDocument> {
        try {
            const newPet = new Pet()
            newPet.userId = user.id
            newPet.name = body.name
            newPet.weight = body.weight
            newPet.age = body.age
            newPet.petType = body.petType as PetType
            newPet.breed = body.breed

            const savedPet = await newPet.save()
            return savedPet.toObject()
        } catch (e) {
            throw new Error(e)
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

    public async addRation(user: UserDocument, petId: string, ration: AddRation): Promise<PetDocument> {
        const rationTime = new Date()
        rationTime.setHours(ration.hours)
        rationTime.setMinutes(ration.minutes)
        const newRation = {
            name: ration.name,
            time: rationTime,
            ration: ration.ration
        }
        try {
            return await Pet.findOneAndUpdate({ _id: petId, userId: user.id}, { $push: { rationPerDay: newRation }}).lean()
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
        const time = new Date()
        time.setMinutes(updateRation.minutes)
        time.setHours(updateRation.hours)
        const newRation = {
            name: updateRation.name,
            time: time,
            ration: updateRation.ration
        }
        try {
            return await Pet.findOneAndUpdate({_id: petId, userId: user.id, 'rationPerDay.name': rationName}, {
                $set:
                    {
                        'rationPerDay.$.name': newRation.name,
                        'rationPerDay.$.time': newRation.time,
                        'rationPerDay.$.ration': newRation.ration,
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
                    rationPerDay: { name: rationName }
                }
            }).lean()
        } catch (e) {
            throw new Error(e)
        }
    }

    public async addFodderToPet(user: UserDocument, petId: string, fodderId: string): Promise<PetDocument> {
        const fodder = await this.fodderService.getFodderById(Types.ObjectId(fodderId))
        if (!fodder) throw new Error("The given fodder id not exist on the system")
        try {
            return await Pet.findOneAndUpdate({ _id: petId, userId: user.id }, { currentFodder: Types.ObjectId(fodderId) }).lean()
        } catch (e) {
            throw new Error(e)
        }
    }

    public async patchFodderToPet(user: UserDocument, petId: string, newFodderId: string): Promise<PetDocument> {
        try {
            return await Pet.findOneAndUpdate({ _id: petId, userId: user.id }, { currentFodder: Types.ObjectId(newFodderId) }).lean()
        } catch (e) {
            throw new Error(e)
        }
    }
}

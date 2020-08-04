import {Service} from "typedi";
import {UserDocument} from "../models/User";
import {Pet, PetDocument} from "../models/Pet";

@Service()
export class PetService {
    public async getPetsByUser(user: UserDocument): Promise<PetDocument[]> {
        try {
            return await Pet.find({userId: user._id}).lean();
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
}

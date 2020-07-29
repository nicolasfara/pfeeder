import {Service} from "typedi";
import {UserDocument} from "../models/User";
import {Pet, PetDocument} from "../models/Pet";

@Service()
export class PetService {
    public async getPetsByUser(user: UserDocument): Promise<PetDocument[]> {
        try {
            return await Pet.find({userId: user._id});
        } catch (e) {
            throw new Error(e);
        }
    }
}

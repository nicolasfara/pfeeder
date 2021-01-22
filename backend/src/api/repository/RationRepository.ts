import {BaseRepository} from "./base/BaseRepository";
import {Ration, RationDocument} from "../models/Ration";

class RationRepository extends BaseRepository<RationDocument> {
    constructor() {
        super(Ration);
    }

    public async getRationWithPet(query: any) {
        return super.findMany(query, undefined, "petId")
    }
}



Object.seal(RationRepository)
export = RationRepository

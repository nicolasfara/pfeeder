import {BaseRepository} from "./base/BaseRepository";
import {Pet, PetDocument} from "../models/Pet";
import {Service} from "typedi";

@Service()
class PetRepository extends BaseRepository<PetDocument> {
    constructor() {
        super(Pet);
    }
}
Object.seal(PetRepository)
export = PetRepository
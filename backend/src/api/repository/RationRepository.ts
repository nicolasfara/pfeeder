import {BaseRepository} from "./base/BaseRepository";
import {Ration, RationDocument} from "../models/Ration";

class RationRepository extends BaseRepository<RationDocument> {
    constructor() {
        super(Ration);
    }
}

Object.seal(RationRepository)
export = RationRepository
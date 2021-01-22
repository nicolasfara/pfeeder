import {BaseRepository} from "./base/BaseRepository";
import {Fodder, FodderDocument} from "../models/Fodder";
import {Service} from "typedi";

@Service()
class FodderRepository extends BaseRepository<FodderDocument> {
    constructor() {
        super(Fodder);
    }
}

Object.seal(FodderRepository)
export = FodderRepository
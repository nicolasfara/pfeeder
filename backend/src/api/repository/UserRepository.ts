import {BaseRepository} from "./base/BaseRepository";
import {User, UserDocument} from "../models/User";
import {Service} from "typedi";

@Service()
class UserRepository extends BaseRepository<UserDocument> {
    constructor() {
        super(User);
    }

    async findOne(query: any, projection?: string, populate?: string): Promise<UserDocument> {
        return this._model.findOne(query, projection).populate(populate)
    }
}
Object.seal(UserRepository)
export = UserRepository
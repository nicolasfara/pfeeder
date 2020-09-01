import {BaseRepository} from "./base/BaseRepository";
import {User, UserDocument} from "../models/User";
import {Service} from "typedi";

@Service()
class UserRepository extends BaseRepository<UserDocument> {
    constructor() {
        super(User);
    }
}
Object.seal(UserRepository)
export = UserRepository
import {Service} from "typedi";
import {User, UserDocument} from '../models/User';
import {HttpError} from "routing-controllers";
import {DuplicateError} from "../errors/DuplicateError";

@Service()
export class UserService {

    public async newUser(user: UserDocument): Promise<UserDocument> {
        let duplicateUser: UserDocument;
        try {
            duplicateUser = await User.findOne({ email: user.email })
        } catch (e) {
            throw new HttpError(500, e);
        }
        if (!duplicateUser) {
            return await user.save();
        }
        throw new DuplicateError();
    }
}

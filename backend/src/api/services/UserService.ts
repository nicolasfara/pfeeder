import {Service} from "typedi";
import {User, UserDocument} from '../models/User';
import {HttpError} from "routing-controllers";
import {DuplicateError} from "../errors/DuplicateError";
import {UserResponse} from "../controllers/UserController";
import {LoggerInterface} from "../../lib/logger";
import {Logger} from "../../decorators/Logger";

@Service()
export class UserService {

    constructor(
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async newUser(user: UserDocument): Promise<UserResponse> {
        let duplicateUser: UserDocument;
        try {
            duplicateUser = await User.findOne({ email: user.email })
        } catch (e) {
            this.log.error(`Catch an exception: ${e}`);
            throw new HttpError(500, e);
        }
        if (!duplicateUser) {
            const savedUser = await user.save();
            const returnUser = new UserResponse();
            returnUser.id = savedUser._id;
            returnUser.email = savedUser.email;
            returnUser.firstName = savedUser.profile.firstName;
            returnUser.lastName = savedUser.profile.lastName;
            this.log.info(`New user create successfully: ${returnUser}`);
            return returnUser;
        }
        throw new DuplicateError();
    }
}

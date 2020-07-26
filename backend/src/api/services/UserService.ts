import {Service} from "typedi";
import {User, UserDocument} from '../models/User';
import {HttpError} from "routing-controllers";
import {DuplicateError} from "../errors/DuplicateError";
import {LoggerInterface} from "../../lib/logger";
import {Logger} from "../../decorators/Logger";

@Service()
export class UserService {

    constructor(
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async newUser(user: UserDocument): Promise<UserDocument> {
        let duplicateUser: UserDocument;
        try {
            duplicateUser = await User.findOne({ email: user.email })
        } catch (e) {
            this.log.error(`Catch an exception: ${e}`);
            throw new HttpError(500, e);
        }
        if (!duplicateUser) {
            return await user.save();
        }
        throw new DuplicateError();
    }

    public async updateUser(user: UserDocument): Promise<UserDocument> {
        try {
            const userUpdate = await User.findOneAndUpdate({ email: user.email }, user);
            if (!userUpdate) {
                throw new HttpError(500, `No user found`);
            }
            return userUpdate;
        } catch (e) {
            throw new HttpError(500, `Unable to update the user`);
        }
    }

    public async deleteUser(id: string): Promise<UserDocument> {
        try {
            return await User.findByIdAndDelete(id);
        } catch (e) {
            throw new Error(`Unable to delete the user with id: ${id}`);
        }
    }
}

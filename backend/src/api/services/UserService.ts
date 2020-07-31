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
            const savedUser = await user.save();
            return savedUser.toObject();
        }
        throw new DuplicateError();
    }

    public async updateUser(user: UserDocument): Promise<UserDocument> {
        try {
            const userUpdate = await User.findOneAndUpdate({ email: user.email }, user).lean() as UserDocument;
            if (!userUpdate) {
                throw new HttpError(500, `No user found`);
            }
            return userUpdate;
        } catch (e) {
            throw new Error(`Unable to update the user: ${e}`);
        }
    }

    public async deleteUser(id: string): Promise<UserDocument> {
        try {
            return await User.findByIdAndDelete(id).lean();
        } catch (e) {
            throw new Error(`Unable to delete the user with id: ${id}: ${e}`);
        }
    }

    public async updatePassword(user: UserDocument, newPassword: string): Promise<UserDocument> {
        try {
            const updateUser = await User.findById(user.id);
            updateUser.password = newPassword;
            const usr = await updateUser.save()
            return usr.toObject();
        } catch (e) {
            throw new Error(`Unable to find the user: ${e}`);
        }
    }
}

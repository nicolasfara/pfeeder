import {BaseMapper} from "./BaseMapper";
import {UserDocument, UserVm} from "../models/User";

export class UserMapper implements BaseMapper<UserVm, UserDocument> {
    mapArrayDocument(document: UserDocument[]): UserVm[] {
        return document.map(this.mapper)
    }

    mapSingleDocument(document: UserDocument): UserVm {
        return this.mapper(document)
    }

    private mapper = (user: UserDocument): UserVm => {
        return {
            id: user._id,
            email: user.email,
            password: user.password,
            passwordResetToken: user.passwordResetToken,
            passwordResetExpires: user.passwordResetExpires,
            role: user.role,
            tokens: user.tokens,
            apiKeys: user.apiKeys,
            profile: user.profile
        }
    }
}
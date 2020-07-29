import bcrypt from "bcrypt";
import crypto from "crypto";
import mongoose from "mongoose";

export type UserDocument = mongoose.Document & {
    email: string;
    password: string;
    passwordResetToken: string;
    passwordResetExpires: Date;

    tokens: AuthToken[];
    apiKeys: string[];

    profile: {
        lastName: string;
        firstName: string;
        gender: string;
        location: string;
        picture: string;
    };

    comparePassword: comparePasswordFunction;
    gravatar: (size: number) => string;
};

type comparePasswordFunction = (candidatePassword: string) => Promise<boolean>;

export interface AuthToken {
    accessToken: string;
    kind: string;
}

const userSchema = new mongoose.Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    passwordResetToken: String,
    passwordResetExpires: Date,

    tokens: Array,
    apiKeys: Array,

    profile: {
        lastName: {type: String, required: true},
        firstName: {type: String, required: true},
        gender: String,
        picture: String
    }
}, {timestamps: true});

/**
 * Password hash middleware.
 */
userSchema.pre("save", async function save(next) {
    try {
        const user = this as UserDocument;
        if (!user.isModified("password")) {
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        const md5 = crypto.createHash("md5").update(user.email).digest("hex");
        user.profile.picture = `https://gravatar.com/avatar/${md5}?s=200&d=retro`;

        next();
    } catch (e) {
        next(e);
    }
});

/**
 * Helper method to check if the given password match the user password.
 * @param data the password to check.
 */
userSchema.methods.comparePassword = function validatePassword(data) {
    return bcrypt.compare(data, this.password);
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function (size: number = 200) {
    if (!this.email) {
        return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }
    const md5 = crypto.createHash("md5").update(this.email).digest("hex");
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

export const User = mongoose.model<UserDocument>("User", userSchema);

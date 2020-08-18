import {Authorized, Body, CurrentUser, Delete, Get, HttpError, JsonController, Patch, Post} from "routing-controllers";
import {OpenAPI, ResponseSchema} from "routing-controllers-openapi";
import {User, UserDocument} from '../models/User';
import {UserService} from "../services/UserService";
import jwt from 'jsonwebtoken';
import {env} from "../../env";
import crypto from 'crypto-js';
import {Logger, LoggerInterface} from "../../decorators/Logger";
import {
    CreateUserBody,
    ForgotPasswordRequest,
    LoginBody,
    ResetPasswordRequest,
    UpdatePassword,
    UpdateUser
} from "./requests/UserRequests";
import {ForgotPasswordResponse, LoginResponse, ResetPasswordResponse, UserResponse} from "./responses/UserResponses";
import {Param} from "routing-controllers/index";


@JsonController('/users')
export class UserController {

    constructor(
        private userService: UserService,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    @Get()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }] })
    public async getCurrentUser(@CurrentUser() user: UserDocument): Promise<UserDocument> {
        return user.toObject();
    }

    /**
     * Create a new user in the system.
     * @param body .
     */
    @Post()
    @ResponseSchema(UserResponse)
    public async createNewUser(@Body() body: CreateUserBody): Promise<UserDocument> {
        const user = new User({
            email: body.email,
            password: body.password,
            profile: {
                firstName: body.firstName,
                lastName: body.lastName
            }
        });
        this.log.info(`Try to create a user with the following value: ${user}`);
        return await this.userService.newUser(user);
    }

    /**
     * Login a user. return the JWT token.
     * @param body username and password are required.
     */
    @Post('/login')
    @ResponseSchema(LoginResponse)
    public async loginUser(@Body() body: LoginBody): Promise<LoginResponse> {
        const user = await User.findOne({ email: body.email });
        if (!user || ! await user.comparePassword(body.password)) {
            this.log.error(`Username or password not valid`);
            throw  new HttpError(401, `Email or password not match`);
        }
        const token = jwt.sign({ id: user._id, email: user.email}, env.app.jwtSecret, { expiresIn: 86400 });
        return new LoginResponse(token);
    }

    /**
     * Update a profile for the authorized user.
     * @param user The current user logged in.
     * @param body Parameters to update.
     */
    @Patch()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }] })
    public async getUser(@CurrentUser() user: UserDocument, @Body() body: UpdateUser): Promise<UserDocument> {
        try {
            return await this.userService.updateUser(body as UserDocument);
        } catch (e) {
            throw new HttpError(500, e.message)
        }
    }

    /**
     * Delete a user with the given ID.
     * @param user the user to delete.
     */
    @Delete()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }] })
    public async deleteUser(@CurrentUser() user: UserDocument): Promise<UserDocument> {
        try {
            return await this.userService.deleteUser(user.id);
        } catch (e) {
            throw new HttpError(500, e.message)
        }
    }

    /**
     * Update the password for the current account.
     * @param user the user to change the password.
     * @param body the new password.
     */
    @Post('/password')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }] })
    public async changePassword(@CurrentUser() user: UserDocument, @Body() body: UpdatePassword): Promise<UserDocument> {
        if (! await user.comparePassword(body.oldPassword)) throw new HttpError(400, `The old password not match`);
        if (body.password !== body.confirmPassword) throw new HttpError(400, `The two password not match`);
        return await this.userService.updatePassword(user, body.password);
    }

    /**
     * Forgot password, send a token for password reset.
     */
    @Post('/forgot')
    @ResponseSchema(ForgotPasswordResponse)
    public async forgotPassword(@Body() body: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
        try {
            const token = crypto.lib.WordArray.random(16).toString()
            const user = await User.findOne({ email: body.email })
            if (!user) throw new HttpError(404, `No user found with email: ${body.email}`)
            user.passwordResetToken = token
            user.passwordResetExpires = new Date(Date.now() + 3600000) // 1 hour
            await user.save()

            // TODO(Send an email with reset token)

            return new ForgotPasswordResponse(token) //TODO(Non inviare il token come risposta)
        } catch (e) {
            throw new HttpError(500, e.message)
        }
    }

    @Post('/reset/:token')
    @ResponseSchema(ResetPasswordResponse)
    public async resetPassword(
        @Body() body: ResetPasswordRequest,
        @Param('token') token: string
    ): Promise<ResetPasswordResponse> {
        if (body.confirmPassword !== body.password) throw new HttpError(400, `the two password doesn't match`)
        try {
            const user = await User.findOne({ passwordResetToken: token })
                .where('passwordResetExpires')
                .gt(Date.now())
            if (!user) throw new HttpError(404, `No token valid found`)
            user.password = body.password
            user.passwordResetToken = undefined
            user.passwordResetExpires = undefined
            await user.save()
            return new ResetPasswordResponse(`Password changed successfully`)
        } catch (e) {
            throw new HttpError(500, e.message)
        }
    }
}

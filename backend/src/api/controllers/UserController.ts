import {Authorized, Body, CurrentUser, Delete, Get, HttpError, JsonController, Patch, Post} from "routing-controllers";
import {OpenAPI, ResponseSchema} from "routing-controllers-openapi";
import {User, UserDocument} from '../models/User';
import {UserService} from "../services/UserService";
import jwt from 'jsonwebtoken';
import {env} from "../../env";
import {Logger, LoggerInterface} from "../../decorators/Logger";
import {CreateUserBody, LoginBody, UpdateUser} from "./requests/UserRequests";
import {LoginResponse, UserResponse} from "./responses/UserResponses";


@JsonController('/user')
export class UserController {

    constructor(
        private userService: UserService,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    @Get()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }] })
    public async getCurrentUser(@CurrentUser() user: UserDocument): Promise<UserDocument> {
        return user;
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
            throw new HttpError(401, `Email or password not match`);
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
        return await this.userService.updateUser(body as UserDocument);
    }

    /**
     * Delete a user with the given ID.
     * @param user the user to delete.
     */
    @Delete()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }] })
    public async deleteUser(@CurrentUser() user: UserDocument): Promise<UserDocument> {
        return await this.userService.deleteUser(user.id);
    }
}

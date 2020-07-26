import {Body, CurrentUser, Get, HttpError, JsonController, Post} from "routing-controllers";
import {IsEmail, IsNotEmpty, IsString, IsUUID} from "class-validator";
import {ResponseSchema} from "routing-controllers-openapi";
import {User, UserDocument} from '../models/User';
import {UserService} from "../services/UserService";
import jwt from 'jsonwebtoken';
import {env} from "../../env";
import {Logger, LoggerInterface} from "../../decorators/Logger";


class BaseUser {
    @IsNotEmpty()
    public firstName: string;

    @IsNotEmpty()
    public lastName: string;

    @IsEmail()
    @IsNotEmpty()
    public email: string;
}

class CreateUserBody extends BaseUser {
    @IsNotEmpty()
    public password: string;
}

export class UserResponse extends BaseUser {
    @IsUUID()
    public id: string;
    @IsEmail()
    public email: string;
}

export class LoginResponse {
    constructor(token: string) {
        this.token = token;
    }
    @IsString()
    public token: string;
}

class LoginBody {
    @IsNotEmpty()
    public email: string;
    @IsNotEmpty()
    public password: string;
}

@JsonController('/user')
export class UserController {

    constructor(
        private userService: UserService,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    /**
     * Create a new user in the system.
     * @param body .
     */
    @Post()
    @ResponseSchema(UserResponse)
    public async createNewUser(@Body() body: CreateUserBody): Promise<UserResponse | HttpError> {
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

    @Get()
    //@Authorized()
    public async getUser(@CurrentUser() user: UserDocument): Promise<UserDocument> {
        return user;
    }
}

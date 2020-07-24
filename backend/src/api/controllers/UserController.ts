import {Body, HttpError, JsonController, Post, UseBefore} from "routing-controllers";
import {IsEmail, IsNotEmpty, IsUUID} from "class-validator";
import {OpenAPI, ResponseSchema} from "routing-controllers-openapi";
import {User} from '../models/User';
import {UserService} from "../services/UserService";
import passport from "passport";

class BaseUser {
    @IsNotEmpty()
    public firstName: string;

    @IsNotEmpty()
    public lastName: string;

    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @IsNotEmpty()
    public username: string;
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

@JsonController('/user')
export class UserController {

    constructor(
        private userService: UserService
    ) { }

    /**
     * Create a new user in the system.
     * @param body .
     */
    @Post()
    @ResponseSchema(UserResponse)
    @UseBefore(passport.authenticate('jwt'))
    @OpenAPI({ security: [{ bearerAuth:[] }]})
    public async createNewUser(@Body() body: CreateUserBody): Promise<UserResponse | HttpError> {
        const user = new User({
            email: body.email,
            password: body.password,
            profile: {
                firstName: body.firstName,
                lastName: body.lastName
            }
        });
        const userRes = await this.userService.newUser(user);
        const res = new UserResponse();
        res.id = userRes._id;
        res.email = userRes.email;
        res.firstName = userRes.profile.firstName;
        res.lastName = userRes.profile.lastName;
        return res;
    }
}

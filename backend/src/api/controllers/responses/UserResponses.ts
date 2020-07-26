import {IsEmail, IsString, IsUUID} from "class-validator";
import {BaseUser} from "../requests/UserRequests";

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

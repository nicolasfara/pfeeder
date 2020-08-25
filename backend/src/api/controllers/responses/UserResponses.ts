import {IsEmail, IsNotEmpty, IsString, IsUUID} from "class-validator";
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

export class DeleteUserResponse {
    constructor(message: string) {
        this.message = message;
    }
    @IsNotEmpty()
    public message: string;
}

export class ForgotPasswordResponse {
    constructor(token: string) {
        this.token = token
    }
    @IsString()
    @IsNotEmpty()
    public token: string
}

export class ResetPasswordResponse {
    constructor(message: string) {
        this.message = message
    }
    @IsString()
    public message: string
}

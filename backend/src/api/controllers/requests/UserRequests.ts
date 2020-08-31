import {IsEmail, IsEmpty, IsNotEmpty, IsString} from "class-validator";

export class BaseUser {
    @IsNotEmpty()
    public firstName: string;

    @IsNotEmpty()
    public lastName: string;

    @IsEmail()
    @IsNotEmpty()
    public email: string;
}

export class CreateUserBody extends BaseUser {
    @IsNotEmpty()
    public password: string;
}

export class LoginBody {
    @IsNotEmpty()
    public email: string;
    @IsNotEmpty()
    public password: string;
}

export class UpdateUser {
    @IsEmpty()
    @IsEmail()
    email: string;
    @IsEmpty()
    profile: {
        lastName: string;
        firstName: string;
        gender: string;
        location: string;
        picture: string;
    };
}

export class UpdatePassword {
    @IsNotEmpty()
    public oldPassword: string;
    @IsNotEmpty()
    public password: string;
    @IsNotEmpty()
    public confirmPassword: string;
}

export class ResetPasswordRequest {
    @IsString()
    @IsNotEmpty()
    public password: string
    @IsString()
    @IsNotEmpty()
    public confirmPassword: string
}

export class ForgotPasswordRequest {
    @IsEmail()
    @IsNotEmpty()
    public email: string
}

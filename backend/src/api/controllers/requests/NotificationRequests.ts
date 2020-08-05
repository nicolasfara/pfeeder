import {IsDate, IsNotEmpty, IsString} from "class-validator";

export class CreateNotification {
    @IsDate()
    @IsNotEmpty()
    public timestamp: Date;
    @IsString()
    @IsNotEmpty()
    notificationType: string;
    @IsString()
    @IsNotEmpty()
    message: string;
}

export class ReadNotification {
    @IsString()
    @IsNotEmpty()
    public notificationId: string
}
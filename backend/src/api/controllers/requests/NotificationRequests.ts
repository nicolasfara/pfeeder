import {IsNotEmpty, IsString} from "class-validator";

export class CreateNotification {
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

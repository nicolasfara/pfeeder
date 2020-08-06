import {IsDate, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateFeed {
    @IsDate()
    @IsNotEmpty()
    public data: Date;

    @IsString()
    @IsNotEmpty()
    public petId: string

    @IsNumber()
    @IsNotEmpty()
    public ration: number
}
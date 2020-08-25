import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateFeed {
    @IsString()
    @IsNotEmpty()
    public petId: string

    @IsNumber()
    @IsNotEmpty()
    public ration: number
}

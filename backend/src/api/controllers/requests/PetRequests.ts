import {IsDate, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class UpdatePet {
    @IsString()
    public name: string;
    @IsNumber()
    public weight: number;
    @IsNumber()
    public age: number;
    @IsString()
    public petType: string;
    @IsString()
    public breed: string;
}

export class AddRation {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsDate()
    @IsNotEmpty()
    time: Date;

    @IsNumber()
    @IsNotEmpty()
    ration: number;
}

export class UpdateRation {
    @IsString()
    name: string;

    @IsDate()
    time: Date;

    @IsNumber()
    ration: number;
}
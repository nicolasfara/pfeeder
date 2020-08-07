import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreatePet {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsNumber()
    @IsNotEmpty()
    weight: number;
    @IsNumber()
    age: number;
    @IsString()
    @IsNotEmpty()
    petType: string;
    @IsString()
    breed: string;
    @IsString()
    currentFodder: string;
}

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

    @IsNumber()
    @IsNotEmpty()
    public minutes: number

    @IsNumber()
    @IsNotEmpty()
    public hours: number

    @IsNumber()
    @IsNotEmpty()
    ration: number;
}

export class UpdateRation {
    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsNumber()
    @IsNotEmpty()
    public hours: number;

    @IsNumber()
    @IsNotEmpty()
    public minutes: number

    @IsNumber()
    @IsNotEmpty()
    public ration: number;
}

export class AddFodderToPet {
    @IsNotEmpty()
    @IsString()
    public fodderId: string
}

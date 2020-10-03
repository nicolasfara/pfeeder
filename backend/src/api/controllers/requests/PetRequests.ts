import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

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
    @IsNumber()
    idealWeight: number;
}

export class UpdatePet {
    @IsString()
    @IsOptional()
    public name?: string;
    @IsNumber()
    @IsOptional()
    public weight?: number;
    @IsNumber()
    @IsOptional()
    public age?: number;
    @IsString()
    @IsOptional()
    public petType?: string;
    @IsString()
    @IsOptional()
    public breed?: string;
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

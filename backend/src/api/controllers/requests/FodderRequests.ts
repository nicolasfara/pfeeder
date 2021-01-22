import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateFodder {
    @IsString()
    @IsNotEmpty()
    public name: string;
    @IsString()
    @IsNotEmpty()
    public companyName: string;
    @IsNumber()
    public price: number;
    @IsNumber()
    @IsNotEmpty()
    public weight: number;
    @IsNumber()
    public kcal: number
    @IsNumber()
    proteins: number;
    @IsNumber()
    fats: number;
    @IsNumber()
    vitamins: number;
    @IsNumber()
    carbohydrates: number;
}

export class PatchFodder {
    @IsString()
    public name: string;
    @IsString()
    public companyName: string;
    @IsNumber()
    public price: number;
    @IsNumber()
    public weight: number;
    @IsNumber()
    kcal: number;
    @IsNumber()
    proteins: number;
    @IsNumber()
    fats: number;
    @IsNumber()
    vitamins: number;
    @IsNumber()
    carbohydrates: number;
}

import {IsNotEmpty, IsNumber, IsObject, IsString} from "class-validator";

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
    @IsObject()
    public nutritionFacts: {
        proteins: number;
        fats: number;
        vitamins: number;
        carbohydrates: number;
    };
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
    @IsObject()
    public nutritionFacts: {
        proteins: number;
        fats: number;
        vitamins: number;
        carbohydrates: number;
    };
}
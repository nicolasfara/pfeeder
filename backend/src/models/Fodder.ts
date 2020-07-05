import mongoose from "mongoose";

export type FodderDocument = mongoose.Document & {
    name: string;
    companyName: string;
    price: number;
    weight: number;
    nutritionFacts: {
        proteins: number;
        fats: number;
        vitamins: number;
        carbohydrates: number;
    };
}

const fodderSchema = new mongoose.Schema({
    name: String,
    companyName: String,
    price: Number,
    weight: Number,
    nutritionFacts: {
        proteins: Number,
        fats: Number,
        vitamins: Number,
        carbohydrates: Number
    }
});

export const Fodder = mongoose.model<FodderDocument>("Fodder", fodderSchema);

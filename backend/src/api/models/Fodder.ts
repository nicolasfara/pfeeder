import mongoose from 'mongoose';
import {nanoid} from 'nanoid';

export type FodderDocument = mongoose.Document & {
    ref: string;
    name: string;
    companyName: string;
    price: number;
    weight: number;
    nutritionFacts: {
        kcal: number;
        proteins: number;
        fats: number;
        vitamins: number;
        carbohydrates: number;
    };
};

const fodderSchema = new mongoose.Schema({
    ref: {type: String, unique: true, default: ()=> nanoid()},
    name: { type: String, required: true },
    companyName: String,
    price: Number,
    weight: Number,
    nutritionFacts: {
        kcal: Number,
        proteins: Number,
        fats: Number,
        vitamins: Number,
        carbohydrates: Number,
    },
});

export const Fodder = mongoose.model<FodderDocument>('Fodder', fodderSchema);

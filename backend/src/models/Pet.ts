import mongoose, {Types} from "mongoose";

export type PetDocument = mongoose.Document & {
    userId: Types.ObjectId;
    name: string;
    weight: number;
    age: number;
    petType: PetType;
    breed: string;
    rationPerDay: Ration[];
    currentFodder: Types.ObjectId;
}

const petSchema = new mongoose.Schema({
    userId: { type: Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
    weight: Number,
    age: Number,
    petType: { type: String, enum: ["dog", "cat", "other"], required: true },
    breed: String,
    rationPerDay: [{
        time: { type: Date, required: true },
        dailyRation: { type: Number, required: true }
    }],
    currentFodder: { type: Types.ObjectId, required: true, ref: "Fodder" }
}, { timestamps: true });

export enum PetType {
    Dog = "dog",
    Cat = "cat",
    Other = "other"
}

export interface Ration {
    time: Date;
    dailyRation: number;
}

export const Pet = mongoose.model<PetDocument>("Pet", petSchema);

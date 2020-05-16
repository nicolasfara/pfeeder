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
    userId: Types.ObjectId,
    name: String,
    weight: Number,
    age: Number,
    petType: {type: String, enum: ["dog", "cat", "other"]},
    breed: String,
    rationPerDay: Array,
    currentFodder: mongoose.Types.ObjectId
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

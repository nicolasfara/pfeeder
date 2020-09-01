import mongoose, { Types } from 'mongoose';
import {nanoid} from 'nanoid';

export type FeedDocument = mongoose.Document & {
    ref: string;
    quantity: number;
    kcal: number;
    fodderId: Types.ObjectId;
    petId: Types.ObjectId;
};

const feedSchema = new mongoose.Schema(
    {
        ref: {type: String, unique: true, default: ()=> nanoid()},
        quantity: Number,
        kcal: Number,
        fodderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fodder', get: v => v.toString()},
        petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', get: v => v.toString()},
    },
    { timestamps: true },
);

export const Feed = mongoose.model<FeedDocument>('Feed', feedSchema);

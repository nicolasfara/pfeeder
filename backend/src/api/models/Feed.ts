import mongoose, { Types } from 'mongoose';

export type FeedDocument = mongoose.Document & {
    data: Date;
    quantity: number;
    kcal: number;
    fodderId: Types.ObjectId;
    petId: Types.ObjectId;
};

const feedSchema = new mongoose.Schema(
    {
        quantity: Number,
        kcal: Number,
        fodderId: { type: Types.ObjectId, ref: 'Fodder' },
        petId: { type: Types.ObjectId, ref: 'Pet' },
    },
    { timestamps: true },
);

export const Feed = mongoose.model<FeedDocument>('Feed', feedSchema);

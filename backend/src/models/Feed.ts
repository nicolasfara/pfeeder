import mongoose, {Types} from "mongoose";

export type FeedDocument = mongoose.Document & {
    data: Date;
    quantity: number;
    kcal: number;
    fodderId: Types.ObjectId;
    petId: Types.ObjectId;
}

const feedSchema = new mongoose.Schema({
    data: Date,
    quantity: Number,
    kcal: Number,
    fodderId: mongoose.Types.ObjectId,
    petId: mongoose.Types.ObjectId
});

export const Feed = mongoose.model<FeedDocument>("Feed", feedSchema);


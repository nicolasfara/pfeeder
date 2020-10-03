import mongoose, {Types, Document, Schema, model} from 'mongoose';

export interface RationDocument extends Document {
    petId: Types.ObjectId
    name: string
    time: Date
    ration: number
}

const rationSchema: Schema = new Schema(
    {
        petId: { type: mongoose.Schema.Types.ObjectId, required: true},
        name: {type: String, required: true},
        time: { type: Date, required: true},
        ration: {type: Number, required: true}
    }, {timestamps: true}
)

export const Ration = model<RationDocument>('Ration', rationSchema)
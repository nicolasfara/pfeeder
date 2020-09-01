import mongoose, {Types, Document, Schema} from 'mongoose';

export interface PetVm {
    id: string;
    userId: string;
    name: string;
    idealWeight: number;
    weight: number;
    age: number;
    petType: string;
    breed: string;
    rationPerDay: [
        {
            name: string;
            time: Date;
            ration: number;
        },
    ];
    currentFodder: string;
}

export interface PetDocument extends Document {
    userId: Types.ObjectId;
    name: string;
    idealWeight: number;
    weight: number;
    age: number;
    petType: PetType;
    breed: string;
    rationPerDay: [
        {
            name: string;
            time: Date;
            ration: number;
        },
    ];
    currentFodder: Types.ObjectId;
}

const petSchema: Schema = new Schema(
    {
        userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
        name: {type: String, required: true},
        weight: Number,
        idealWeight: Number,
        age: Number,
        petType: {type: String, enum: ['dog', 'cat', 'other'], required: true},
        breed: String,
        currentFodder: {type: mongoose.Schema.Types.ObjectId, ref: 'Fodder'},
        rationPerDay: [
            {
                name: {type: String, required: true, unique: true},
                time: {type: Date, required: true, unique: true},
                ration: {type: Number, required: true},
            }
        ]
    },
    {timestamps: true},
);

export enum PetType {
    Dog = 'dog',
    Cat = 'cat',
    Other = 'other',
}

export const Pet = mongoose.model<PetDocument>('Pet', petSchema);

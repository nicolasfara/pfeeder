import mongoose, {Types} from 'mongoose';

export type PetDocument = mongoose.Document & {
    userId: Types.ObjectId;
    name: string;
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
};

const petSchema = new mongoose.Schema(
    {
        userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
        name: {type: String, required: true},
        weight: Number,
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

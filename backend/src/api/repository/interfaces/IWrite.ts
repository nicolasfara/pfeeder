import * as mongoose from "mongoose";

export interface IWrite<T> {
    create(item: T): Promise<boolean>
    update(id: mongoose.Types.ObjectId, item: T): Promise<boolean>
    delete(id: mongoose.Types.ObjectId): Promise<boolean>
}
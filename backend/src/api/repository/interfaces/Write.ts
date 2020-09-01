import * as mongoose from "mongoose";

export interface Write<T> {
    create(item: T): Promise<boolean>
    update(id: mongoose.Types.ObjectId, item: T): Promise<boolean>
    delete(id: mongoose.Types.ObjectId): Promise<boolean>
}
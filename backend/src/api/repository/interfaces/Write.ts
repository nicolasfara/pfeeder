import * as mongoose from "mongoose";

export interface Write<T> {
    create(item: T): Promise<T>
    update(id: mongoose.Types.ObjectId, item: T): Promise<T>
    updateWithQuery(query: any, item: any): Promise<T>
    delete(id: mongoose.Types.ObjectId): Promise<T>
}
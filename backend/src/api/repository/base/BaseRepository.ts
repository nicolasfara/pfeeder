import {Document, Model, Types} from "mongoose";
import {Write} from "../interfaces/Write";
import {Read} from "../interfaces/Read";

export class BaseRepository<T extends Document> implements Write<T>, Read<T> {
    private _model: Model<T>

    constructor(schemaModel: Model<T>) {
        this._model = schemaModel
    }

    async create(item: T): Promise<T> {
        return await this._model.create(item as any)
    }

    async delete(id: Types.ObjectId): Promise<T> {
        return await this._model.findByIdAndDelete(id).exec()
    }

    async findById(id: string): Promise<T> {
        return this._model.findById(id) as any
    }

    async retrieve(): Promise<T[]> {
        return await this._model.find().exec()
    }

    async update(id: Types.ObjectId, item: T): Promise<T> {
        return await this._model.findByIdAndUpdate(id, item).exec()
    }

    async findOne(query: any): Promise<T> {
        return await this._model.findOne(query).exec()
    }

    async findMany(query: any): Promise<T[]> {
        return await this._model.find(query).exec()
    }
}

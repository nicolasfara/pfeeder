import {Document, Model, Types} from "mongoose";
import {Write} from "../interfaces/Write";
import {Read} from "../interfaces/Read";

export class BaseRepository<T extends Document> implements Write<T>, Read<T> {
    protected _model: Model<T>

    constructor(schemaModel: Model<T>) {
        this._model = schemaModel
    }

    async create(item: T): Promise<T> {
        const newObj = await this._model.create(item as any)
        return newObj.toObject()
    }

    async delete(id: Types.ObjectId): Promise<T> {
        return this._model.findByIdAndDelete(id).lean()
    }

    async findById(id: string, projection?: string, populate?: string): Promise<T> {
        return this._model.findById(id, projection).populate(populate).lean()
    }

    async retrieve(): Promise<T[]> {
        return this._model.find().lean()
    }

    async update(id: Types.ObjectId, item: T): Promise<T> {
        return this._model.findByIdAndUpdate(id, item).lean()
    }

    async findOne(query: any, projection?: string, populate?: string): Promise<T> {
        return this._model.findOne(query, projection).populate(populate).lean()
    }

    async findMany(query: any, projection?: string, populate?: string): Promise<T[]> {
        return this._model.find(query, projection).populate(populate).lean()
    }

    async updateWithQuery(query: any, item: any): Promise<T> {
        return this._model.findOneAndUpdate(query, item).lean()
    }

    async findAndUpdate(query: any, item: any): Promise<T> {
        return this._model.findOneAndUpdate(query, item).lean()
    }
}

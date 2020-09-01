import * as mongoose from "mongoose";
import {Write} from "../interfaces/Write";
import {Read} from "../interfaces/Read";

export class BaseRepository<T extends mongoose.Document> implements Write<T>, Read<T> {
    private _model: mongoose.Model<mongoose.Document>

    constructor(schemaModel: mongoose.Model<mongoose.Document>) {
        this._model = schemaModel
    }

    async create(item: T): Promise<boolean> {
        const document = await this._model.create(item)
        return !!document;
    }

    async delete(id: mongoose.Types.ObjectId): Promise<boolean> {
        const deleteDocument = await this._model.remove({ _id: id })
        return !!deleteDocument
    }

    async findById(id: string): Promise<T> {
        return this._model.findById(id) as any;
    }

    async retrieve(): Promise<T[]> {
        return this._model.find() as any;
    }

    async update(id: mongoose.Types.ObjectId, item: T): Promise<boolean> {
        const updatedDocument = await this._model.update({ _id: id}, item)
        return !!updatedDocument
    }

    async find(query: any): Promise<T> {
        return this._model.findOne(query) as any
    }
}

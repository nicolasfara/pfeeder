import * as mongoose from "mongoose";
import {IWrite} from "../interfaces/IWrite";
import {IRead} from "../interfaces/IRead";

export class BaseRepository<T extends mongoose.Document> implements IWrite<T>, IRead<T> {
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

    async findById(id: string): Promise<mongoose.Document> {
        return this._model.findById(id);
    }

    async retrieve(): Promise<mongoose.Document[]> {
        return this._model.find();
    }

    async update(id: mongoose.Types.ObjectId, item: T): Promise<boolean> {
        const updatedDocument = await this._model.update({ _id: id}, item)
        return !!updatedDocument
    }

    async find(query: any): Promise<mongoose.Document> {
        return this._model.findOne(query)
    }

}
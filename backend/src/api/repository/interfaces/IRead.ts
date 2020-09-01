import * as mongoose from "mongoose";

export interface IRead<T> {
    retrieve(): Promise<mongoose.Document[]>
    findById(id: string): Promise<mongoose.Document>
    find(query: any): Promise<mongoose.Document>
}
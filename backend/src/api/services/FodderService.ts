import {Service} from "typedi";
import {Fodder, FodderDocument} from "../models/Fodder";
import {Types} from "mongoose";

@Service()
export class FodderService {

    public async getFodderById(id: Types.ObjectId): Promise<FodderDocument> {
        try {
            return await Fodder.findById(id)
        } catch (e) {
            throw new Error(e)
        }
    }

}
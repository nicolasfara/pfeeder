import {Service} from "typedi";
import {Fodder, FodderDocument} from "../models/Fodder";
import {Types} from "mongoose";
import {CreateFodder, PatchFodder} from "../controllers/requests/FodderRequests";

@Service()
export class FodderService {

    public async getFodderById(id: Types.ObjectId): Promise<FodderDocument> {
        try {
            return await Fodder.findById(id).lean()
        } catch (e) {
            throw new Error(e)
        }
    }

    public async getAllFodders(): Promise<FodderDocument[]> {
        try {
            return await Fodder.find().lean()
        } catch (e) {
            throw new Error(e)
        }
    }

    public async createNewFodder(fodderBody: CreateFodder): Promise<FodderDocument> {
        try {
            const fodder = new Fodder(fodderBody)
            const savedFodder = await fodder.save()
            return savedFodder.toObject()
        } catch (e) {
            throw new Error(e)
        }
    }

    public async patchFodderById(id: string, patch: PatchFodder): Promise<FodderDocument> {
        try {
            return await Fodder.findOneAndUpdate({_id: id}, patch).lean()
        } catch (e) {
            throw new Error(e)
        }
    }
}

import {Authorized, Body, Get, JsonController, Param, Patch, Post} from "routing-controllers";
import {OpenAPI} from "routing-controllers-openapi";
import {CreateFodder, PatchFodder} from "./requests/FodderRequests";
import {FodderDocument, Fodder} from "../models/Fodder";
import FodderRepository from "../repository/FodderRepository";
import {Types} from "mongoose";

@JsonController('/fodders')
export class FodderController {

    constructor(
        private fodderRepository: FodderRepository
    ) {
    }

    @Get()
    public async getAllFodder(): Promise<FodderDocument[]> {
        return this.fodderRepository.retrieve()
    }

    @Post()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }] })
    public async createFodder(@Body() body: CreateFodder): Promise<FodderDocument> {
        const fodder = new Fodder()
        fodder.nutritionFacts = {
            kcal: body.kcal,
            proteins: body.proteins,
            fats: body.fats,
            vitamins: body.vitamins,
            carbohydrates: body.carbohydrates
        }
        fodder.companyName = body.companyName
        fodder.name = body.name
        fodder.price = body.price
        fodder.weight = body.weight
        return this.fodderRepository.create(fodder)
    }

    @Patch('/:id')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }] })
    public async patchFodderById(@Param('id') id: string, @Body() body: PatchFodder): Promise<FodderDocument> {
        const fodder = await this.fodderRepository.findOne({ _id: id })
        fodder.nutritionFacts = {
            kcal: body.kcal,
            proteins: body.proteins,
            fats: body.fats,
            vitamins: body.vitamins,
            carbohydrates: body.carbohydrates
        }
        fodder.companyName = body.companyName
        fodder.name = body.name
        fodder.price = body.price
        fodder.weight = body.weight
        return this.fodderRepository.update(Types.ObjectId(id), fodder)
    }
}

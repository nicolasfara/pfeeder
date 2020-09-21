import {Authorized, Body, CurrentUser, Get, HttpError, JsonController, Param, Patch, Post} from "routing-controllers";
import {OpenAPI} from "routing-controllers-openapi";
import {UserDocument} from "../models/User";
import {Logger, LoggerInterface} from "../../decorators/Logger";
import RationRepository from "../repository/RationRepository";
import PetRepository from "../repository/PetRepository";
import {Types} from "mongoose";
import {AddRation, UpdateRation} from "./requests/PetRequests";
import {PetDocument} from "../models/Pet";
import {Ration, RationDocument} from "../models/Ration";

@JsonController('/rations')
export class RationController {
    constructor(
        private rationRepository: RationRepository,
        private petRepository: PetRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    @Post('/rations/:petId')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async addRationToPet(@CurrentUser() user: UserDocument, @Param("petId") petId: string, @Body() body: AddRation): Promise<PetDocument> {
        const rationTime = new Date()
        rationTime.setHours(body.hours)
        rationTime.setMinutes(body.minutes)
        const newRation = new Ration()
        newRation.petId = Types.ObjectId(petId)
        newRation.name = body.name
        newRation.time = rationTime
        newRation.ration = body.ration
        const savedRation = await newRation.save()
        if (!savedRation) throw new HttpError(500, `Unable to save the ration on DB`)
        return await this.petRepository.updateWithQuery({ _id: petId }, {$push: { rationPerDay: newRation.id }})
    }

    @Get()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async getUserRations(@CurrentUser() user: UserDocument) {
        this.log.info("All rations")
        const petId = (await this.petRepository.findMany({ userId: user.id })).map(p => Types.ObjectId(p._id))
        return this.rationRepository.findMany({ petId: { $in: petId }})
    }

    @Patch('/rations/:petId/:rationName')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async patchRationByName(
        @CurrentUser() user: UserDocument,
        @Param("petId") petId: string,
        @Param("rationName") rationName: string,
        @Body() body: UpdateRation
    ): Promise<RationDocument> {
        const newTime = new Date()
        newTime.setMinutes(body.minutes)
        newTime.setHours(body.hours)
        const newRation = {
            name: body.name,
            time: newTime,
            ration: body.ration
        }
        return this.rationRepository.updateWithQuery({ petId, name: rationName}, newRation)
    }

    @Get('/rations/:petId')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async getAllPetRations(@CurrentUser() user: UserDocument, @Param("petId") petId: string): Promise<RationDocument[]> {
        return this.rationRepository.findMany({ petId })
    }
}
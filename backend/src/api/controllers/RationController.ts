import {
    Authorized,
    Body,
    CurrentUser,
    Delete,
    Get,
    HttpError,
    JsonController,
    Param,
    Patch,
    Post
} from "routing-controllers";
import {OpenAPI} from "routing-controllers-openapi";
import {UserDocument} from "../models/User";
import {Logger, LoggerInterface} from "../../decorators/Logger";
import RationRepository from "../repository/RationRepository";
import PetRepository from "../repository/PetRepository";
import {Types} from "mongoose";
import {AddRation, UpdateRation} from "./requests/PetRequests";
import {PetDocument} from "../models/Pet";
import {Ration, RationDocument} from "../models/Ration";
import {client} from "../../loaders/mqttLoader";

@JsonController('/rations')
export class RationController {
    constructor(
        private rationRepository: RationRepository,
        private petRepository: PetRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    @Post('/:petId')
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
        this.log.info("Publish MQTT")
        user.apiKeys.forEach(api => client.publish(api, newRation.toString()))
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

    @Patch('/:rationId')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async patchRationByName(
        @CurrentUser() user: UserDocument,
        @Param("rationId") rationId: string,
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
        const rationToDelete = await this.rationRepository.findOne({_id: rationId})
        const petId = rationToDelete.petId
        const rationName = rationToDelete.name

        return this.rationRepository.updateWithQuery({ petId, name: rationName }, newRation)
    }

    @Get('/:petId')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async getAllPetRations(@CurrentUser() user: UserDocument, @Param("petId") petId: string): Promise<RationDocument[]> {
        return this.rationRepository.findMany({ petId })
    }


    @Delete('/:rationId/')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async deleteRation(
        @CurrentUser() user: UserDocument,
        @Param("rationId") rationId: string,
    ): Promise<PetDocument> {
        const rationToDelete = await this.rationRepository.findOne({_id: rationId})
        const petId = rationToDelete.petId
        const rationName = rationToDelete.name

        const removedRation = await this.rationRepository.findAndDelete({ petId, name: rationName })
        if (!removedRation) throw new HttpError(500, `Unable to remove the given ration`)
        return this.petRepository.findAndUpdate({_id: petId, userId: user.id },
            {
                $pull: { rationPerDay: removedRation.id }
            })
    }
}

import {
    Authorized,
    Body,
    CurrentUser,
    Delete,
    Get, HttpError,
    JsonController,
    Param,
    Patch, Post
} from "routing-controllers";
import {Logger, LoggerInterface} from "../../decorators/Logger";
import {PetDocument, Pet, PetType} from "../models/Pet";
import {Ration, RationDocument} from "../models/Ration";
import {UserDocument} from "../models/User";
import {OpenAPI} from "routing-controllers-openapi";
import {AddFodderToPet, AddRation, CreatePet, UpdatePet, UpdateRation} from "./requests/PetRequests";
import PetRepository from "../repository/PetRepository";
import {Types} from "mongoose";
import RationRepository from "../repository/RationRepository";

@JsonController('/pets')
export class PetController {
    constructor(
        private petRepository: PetRepository,
        private rationRepository: RationRepository,
        @Logger(__filename) private log: LoggerInterface
    ) {
    }

    @Get()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async getUserPets(@CurrentUser() user: UserDocument): Promise<PetDocument[]> {
        this.log.info(`Return all pets for user: ${user.email}`);
        return await this.petRepository.findMany({ userId: user.id })
    }

    @Get('/:id')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async getPetById(@CurrentUser() user: UserDocument, @Param("id") id: string): Promise<PetDocument> {
        return await this.petRepository.findOne({ ref: id, userId: user.id })
    }

    @Post()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async createPet(@CurrentUser() user: UserDocument, @Body() body: CreatePet): Promise<PetDocument> {
        const newPet = new Pet()
        newPet.name = body.name
        newPet.currentFodder = Types.ObjectId(body.currentFodder)
        newPet.userId = user.id
        newPet.weight = body.weight
        newPet.petType = body.petType as PetType
        newPet.breed = body.breed
        newPet.age = body.age
        newPet.idealWeight = body.idealWeight
        return await this.petRepository.create(newPet)
    }

    @Patch('/:id')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async patchPetById(@CurrentUser() user: UserDocument, @Param("id") id: string, @Body() body: UpdatePet): Promise<PetDocument> {
        return await this.petRepository.update(Types.ObjectId(id), body as PetDocument)
    }

    @Delete('/:id')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async deletePetById(@CurrentUser() user: UserDocument, @Param("id") id: string): Promise<PetDocument> {
        return await this.petRepository.delete(Types.ObjectId(id))
    }

    @Post('/:id/rations')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async addRationToPet(@CurrentUser() user: UserDocument, @Param("id") id: string, @Body() body: AddRation): Promise<PetDocument> {
        const rationTime = new Date()
        rationTime.setHours(body.hours)
        rationTime.setMinutes(body.minutes)
        const newRation = new Ration()
        newRation.petId = Types.ObjectId(id)
        newRation.name = body.name
        newRation.time = rationTime
        newRation.ration = body.ration
        const savedRation = await newRation.save()
        if (!savedRation) throw new HttpError(500, `Unable to save the ration on DB`)
        return await this.petRepository.updateWithQuery({ _id: id}, {$push: { rationPerDay: newRation.id }})
    }

    @Get('/rations')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async getAllUserRations(@CurrentUser() user: UserDocument): Promise<RationDocument[]> {
        const petsId = (await this.petRepository.findMany({ userId: user.id})).map(p => Types.ObjectId(p.id))
        return this.rationRepository.findMany({ petId: { $in: petsId }})
    }

    @Get('/:id/rations')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async getAllPetRations(@CurrentUser() user: UserDocument, @Param("id") id: string): Promise<RationDocument[]> {
        return this.rationRepository.findMany({ petId: id })
    }

    @Patch('/:petId/rations/:rationName')
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

    @Delete('/:petId/rations/:rationName')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async deleteRation(
        @CurrentUser() user: UserDocument,
        @Param("petId") petId: string,
        @Param("rationName") rationName: string
    ): Promise<PetDocument> {
        const removedRation = await this.rationRepository.findAndDelete({petId, name: rationName})
        if (!removedRation) throw new HttpError(500, `Unable to remove the given ration`)
        return this.petRepository.findAndUpdate({_id: petId, userId: user.id },
            {
                $pull: { rationPerDay: removedRation.id }
            })
    }

    @Post('/:id/fodder')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async addFodderToPet(
        @CurrentUser() user: UserDocument,
        @Param("id") id: string,
        @Body() body: AddFodderToPet
    ): Promise<PetDocument> {
        return await this.petRepository.addFodderToPet(Types.ObjectId(id), user.id, Types.ObjectId(body.fodderId))
    }

    @Get('/:id/fodder')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async getFodderFromPet(
        @CurrentUser() user: UserDocument,
        @Param("id") id: string
    ): Promise<PetDocument> {
        return await this.petRepository.getFodderFromPet(Types.ObjectId(id), user.id)
    }

    @Patch('/:id/fodder')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async patchFodderForPet(
        @CurrentUser() user: UserDocument,
        @Param("id") id: string,
        @Body() body: AddFodderToPet
    ): Promise<PetDocument> {
        return await this.petRepository.updateFodderForPet(Types.ObjectId(id), user.id, Types.ObjectId(body.fodderId))
    }
}

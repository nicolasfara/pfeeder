import {
    Authorized,
    Body,
    CurrentUser,
    Delete,
    Get,
    JsonController,
    Param,
    Patch, Post
} from "routing-controllers";
import {Logger, LoggerInterface} from "../../decorators/Logger";
import {PetDocument, Pet, PetType} from "../models/Pet";
import {UserDocument} from "../models/User";
import {OpenAPI} from "routing-controllers-openapi";
import {AddFodderToPet, CreatePet, UpdatePet} from "./requests/PetRequests";
import PetRepository from "../repository/PetRepository";
import {Types} from "mongoose";

@JsonController('/pets')
export class PetController {
    constructor(
        private petRepository: PetRepository,
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

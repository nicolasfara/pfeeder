import {
    Authorized,
    Body,
    CurrentUser,
    Delete,
    Get,
    HttpError,
    JsonController,
    Param,
    Patch, Post, QueryParam
} from "routing-controllers";
import {Logger, LoggerInterface} from "../../decorators/Logger";
import {PetService} from "../services/PetService";
import {PetDocument, PetVm, Pet, PetType} from "../models/Pet";
import {UserDocument} from "../models/User";
import {OpenAPI} from "routing-controllers-openapi";
import {AddFodderToPet, AddRation, CreatePet, UpdatePet, UpdateRation} from "./requests/PetRequests";
import {FodderDocument} from "../models/Fodder";
import {FodderService} from "../services/FodderService";
import {FeedService} from "../services/FeedService";
import PetRepository from "../repository/PetRepository";
import {PetMapper} from "../mappers/PetMapper";
import {Types} from "mongoose";

@JsonController('/pets')
export class PetController {
    constructor(
        private petService: PetService,
        private fodderService: FodderService,
        private feedService: FeedService,
        private petRepository: PetRepository,
        private petMapper: PetMapper,
        @Logger(__filename) private log: LoggerInterface
    ) {
    }

    @Get()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async getUserPets(@CurrentUser() user: UserDocument): Promise<PetVm[]> {
        this.log.info(`Return all pets for user: ${user.email}`);
        return this.petMapper.mapArrayDocument(await this.petRepository.findMany({ userId: user.id }))
    }

    @Get('/:id')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async getPetById(@CurrentUser() user: UserDocument, @Param("id") id: string): Promise<PetVm> {
        return this.petMapper.mapSingleDocument(await this.petRepository.findOne({ ref: id, userId: user.id }))
    }

    @Post()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async createPet(@CurrentUser() user: UserDocument, @Body() body: CreatePet): Promise<PetVm> {
        const newPet = new Pet()
        newPet.name = body.name
        newPet.currentFodder = Types.ObjectId(body.currentFodder)
        newPet.userId = user.id
        newPet.weight = body.weight
        newPet.petType = body.petType as PetType
        newPet.breed = body.breed
        newPet.age = body.age
        newPet.idealWeight = body.idealWeight
        return this.petMapper.mapSingleDocument(await this.petRepository.create(newPet))
    }

    @Patch('/:id')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async patchPetById(@CurrentUser() user: UserDocument, @Param("id") id: string, @Body() body: UpdatePet): Promise<PetDocument> {
        try {
            return await this.petService.patchPetById(user, id, body)
        } catch (e) {
            throw new HttpError(500, e.message);
        }
    }

    @Delete('/:id')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async deletePetById(@CurrentUser() user: UserDocument, @Param("id") id: string): Promise<PetDocument> {
        try {
            return this.petService.deletePetById(user, id)
        } catch (e) {
            throw new HttpError(500, e.message)
        }
    }

    @Post('/:id/rations')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async addRationToPet(@CurrentUser() user: UserDocument, @Param("id") id: string, @Body() body: AddRation): Promise<PetDocument> {
        try {
            return await this.petService.addRation(user, id, body)
        } catch (e) {
            throw new HttpError(500, e.message)
        }
    }

    @Get('/:id/rations')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async getAllRations(@CurrentUser() user: UserDocument, @Param("id") id: string): Promise<PetDocument> {
        try {
            return await this.petService.getAllRations(user, id)
        } catch (e) {
            throw new HttpError(500, e.message)
        }
    }

    @Patch('/:pet_id/rations/:ration_name')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async patchRationByName(
        @CurrentUser() user: UserDocument,
        @Param("pet_id") pet_id: string,
        @Param("ration_name") ration_name: string,
        @Body() body: UpdateRation
    ): Promise<PetDocument> {
        try {
            return await this.petService.updateRationByName(user, pet_id, ration_name, body)
        } catch (e) {
            throw new HttpError(500, e.message)
        }
    }

    @Delete('/:pet_id/rations/:ration_name')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async deleteRation(
        @CurrentUser() user: UserDocument,
        @Param("pet_id") pet_id: string,
        @Param("ration_name") ration_name: string
    ): Promise<PetDocument> {
        try {
            return await this.petService.deleteRationByName(user, pet_id, ration_name)
        } catch (e) {
            throw new HttpError(500, e.message);
        }
    }

    @Post('/:id/fodder')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async addFodderToPet(
        @CurrentUser() user: UserDocument,
        @Param("id") id: string,
        @Body() body: AddFodderToPet
    ): Promise<PetDocument> {
        try {
            return await this.petService.addFodderToPet(user, id, body.fodderId)
        } catch (e) {
            throw new HttpError(500, e.message)
        }
    }

    @Get('/:id/fodder')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async getFodderFromPet(
        @CurrentUser() user: UserDocument,
        @Param("id") id: string
    ): Promise<FodderDocument> {
        try {
            const pet = await this.petService.getPetById(user, id)
            if (pet) {
                return await this.fodderService.getFodderById(pet.currentFodder)
            }
        } catch (e) {
            throw new HttpError(500, e.message)
        }
        throw new HttpError(404, `Pet with id: ${id} not found`)
    }

    @Patch('/:id/fodder')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async patchFodderForPet(
        @CurrentUser() user: UserDocument,
        @Param("id") id: string,
        @Body() body: AddFodderToPet
    ): Promise<PetDocument> {
        try {
            return await this.petService.patchFodderToPet(user, id, body.fodderId)
        } catch (e) {
            throw new HttpError(500, e.message)
        }
    }

    @Get('/:id/cost')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async getCostByPet(
        @CurrentUser() user: UserDocument,
        @Param('id') id: string,
        @QueryParam('days') days: number
    ): Promise<number> {
        try {
            let feedsByPet: any
            if (days) {
                feedsByPet = await this.feedService.getAllFeedsByPetByDays(id, days)
            } else {
                feedsByPet = await this.feedService.getAllFeedsByPet(id)
            }
            if (feedsByPet.length > 0) {
                return feedsByPet.map(e => e.fodderId.price).reduce((acc, curr) => acc + curr)
            } else {
                throw new Error(`Unable to find feeds for this pet`)
            }
        } catch (e) {
            throw new HttpError(500, e.message)
        }
    }
}

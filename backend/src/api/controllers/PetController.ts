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
import {PetDocument, Pet, PetType} from "../models/Pet";
import {UserDocument} from "../models/User";
import {OpenAPI} from "routing-controllers-openapi";
import {AddFodderToPet, AddRation, CreatePet, UpdatePet, UpdateRation} from "./requests/PetRequests";
import {FeedService} from "../services/FeedService";
import PetRepository from "../repository/PetRepository";
import {Types} from "mongoose";

@JsonController('/pets')
export class PetController {
    constructor(
        private feedService: FeedService,
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

    @Post('/:id/rations')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async addRationToPet(@CurrentUser() user: UserDocument, @Param("id") id: string, @Body() body: AddRation): Promise<PetDocument> {
        const rationTime = new Date()
        rationTime.setHours(body.hours)
        rationTime.setMinutes(body.minutes)
        const newRation = {
            name: body.name,
            time: rationTime,
            ration: body.ration
        }
        return await this.petRepository.update(Types.ObjectId(id), { $push: { rationPerDay: newRation }} as any)
    }

    @Get('/:id/rations')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async getAllRations(@CurrentUser() user: UserDocument, @Param("id") id: string): Promise<PetDocument> {
        return await this.petRepository.findOne({ userId: user.id, _id: id }, "rationPerDay")
    }

    @Patch('/:petId/rations/:rationName')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async patchRationByName(
        @CurrentUser() user: UserDocument,
        @Param("petId") petId: string,
        @Param("rationName") rationName: string,
        @Body() body: UpdateRation
    ): Promise<PetDocument> {
        const newTime = new Date()
        newTime.setMinutes(body.minutes)
        newTime.setHours(body.hours)
        const newRation = {
            name: body.name,
            time: newTime,
            ration: body.ration
        }
        return await this.petRepository.updateWithQuery(
            {_id: petId, userId: user.id, 'rationPerDay.name': rationName},
            {
                $set:
                    {
                        'rationPerDay.$.name': newRation.name,
                        'rationPerDay.$.time': newRation.time,
                        'rationPerDay.$.ration': newRation.ration,
                    }
            })
    }

    @Delete('/:petId/rations/:rationName')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async deleteRation(
        @CurrentUser() user: UserDocument,
        @Param("petId") petId: string,
        @Param("rationName") rationName: string
    ): Promise<PetDocument> {
        /*try {
            return await this.petService.deleteRationByName(user, pet_id, ration_name)
        } catch (e) {
            throw new HttpError(500, e.message);
        }*/
        return await this.petRepository.updateWithQuery({_id: petId, userId: user.id, 'rationPerDay.name': rationName},
            {
                $pull: {
                    rationPerDay: { name: rationName }
                }
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
        /*try {
            return await this.petService.addFodderToPet(user, id, body.fodderId)
        } catch (e) {
            throw new HttpError(500, e.message)
        }*/
        return await this.petRepository.updateWithQuery(
            { _id: id, userId: user.id },
            { currentFodder: Types.ObjectId(body.fodderId) }
            )
    }

    @Get('/:id/fodder')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async getFodderFromPet(
        @CurrentUser() user: UserDocument,
        @Param("id") id: string
    ): Promise<PetDocument> {
        return await this.petRepository.findById(id, "currentFodder", "currentFodder")
    }

    @Patch('/:id/fodder')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async patchFodderForPet(
        @CurrentUser() user: UserDocument,
        @Param("id") id: string,
        @Body() body: AddFodderToPet
    ): Promise<PetDocument> {
        return await this.petRepository.updateWithQuery(
            { _id: id, userId: user.id },
            { currentFodder: Types.ObjectId(body.fodderId) }
            )
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

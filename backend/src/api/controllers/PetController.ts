import {
    Authorized,
    Body,
    CurrentUser,
    Delete,
    Get,
    HttpError,
    JsonController,
    Param,
    Patch, Post
} from "routing-controllers/index";
import {Logger, LoggerInterface} from "../../decorators/Logger";
import {PetService} from "../services/PetService";
import {PetDocument} from "../models/Pet";
import {UserDocument} from "../models/User";
import {OpenAPI} from "routing-controllers-openapi";
import {AddRation, UpdatePet} from "./requests/PetRequests";

@JsonController('/pets')
export class PetController {
    constructor(
        private petService: PetService,
        @Logger(__filename) private log: LoggerInterface
    ) {
    }

    @Get()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async getUserPets(@CurrentUser() user: UserDocument): Promise<PetDocument[]> {
        this.log.info(`Return all pets for user: ${user.email}`);
        try {
            if (user.role.includes('admin')) {
                return await this.petService.getAllPets();
            } else {
                return await this.petService.getPetsByUser(user);
            }
        } catch (e) {
            throw new HttpError(500, e);
        }
    }

    @Get('/:id')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async getPetById(@CurrentUser() user: UserDocument, @Param("id") id: string): Promise<PetDocument> {
        try {
            return this.petService.getPetById(user, id);
        } catch (e) {
            throw new HttpError(500, e);
        }
    }

    @Patch('/:id')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async patchPetById(@CurrentUser() user: UserDocument, @Param("id") id: string, @Body() body: UpdatePet): Promise<PetDocument> {
        try {
            return await this.petService.patchPetById(user, id, body)
        } catch (e) {
            throw new HttpError(500, e);
        }
    }

    @Delete('/:id')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async deletePetById(@CurrentUser() user: UserDocument, @Param("id") id: string): Promise<PetDocument> {
        try {
            return this.petService.deletePetById(user, id)
        } catch (e) {
            throw new HttpError(500, e)
        }
    }

    @Post('/:id/rations')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async addRationToPet(@CurrentUser() user: UserDocument, @Param("id") id: string, @Body() body: AddRation): Promise<PetDocument> {
        try {
            return await this.petService.addRation(user, id, body)
        } catch (e) {
            throw new HttpError(500, e)
        }
    }

    @Get('/:id/rations')
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async getAllRations(@CurrentUser() user: UserDocument, @Param("id") id: string): Promise<PetDocument> {
        try {
            return await this.petService.getAllRations(user, id)
        } catch (e) {
            throw new HttpError(500, e)
        }
    }
}

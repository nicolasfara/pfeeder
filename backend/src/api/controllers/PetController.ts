import {Authorized, CurrentUser, Get, HttpError, JsonController} from "routing-controllers/index";
import {Logger, LoggerInterface} from "../../decorators/Logger";
import {PetService} from "../services/PetService";
import {PetDocument} from "../models/Pet";
import {UserDocument} from "../models/User";
import {OpenAPI} from "routing-controllers-openapi";

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
            return await this.petService.getPetsByUser(user);
        } catch (e) {
            throw new HttpError(500, e);
        }
    }
}

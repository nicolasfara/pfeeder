import {Authorized, CurrentUser, Get, JsonController} from "routing-controllers";
import {OpenAPI} from "routing-controllers-openapi";
import {UserDocument} from "../models/User";
import {Logger, LoggerInterface} from "../../decorators/Logger";
import RationRepository from "../repository/RationRepository";
import PetRepository from "../repository/PetRepository";
import {Types} from "mongoose";

@JsonController('/rations')
export class RationController {
    constructor(
        private rationRepository: RationRepository,
        private petRepository: PetRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    @Get()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }]})
    public async getUserRations(@CurrentUser() user: UserDocument) {
        this.log.info("All rations")
        const petId = (await this.petRepository.findMany({ userId: user.id })).map(p => Types.ObjectId(p._id))
        return this.rationRepository.findMany({ petId: { $in: petId }})
    }
}
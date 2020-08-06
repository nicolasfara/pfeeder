import {Authorized, Body, Get, HttpError, JsonController, Param, Patch, Post} from "routing-controllers/index";
import {OpenAPI} from "routing-controllers-openapi";
import {FodderService} from "../services/FodderService";
import {CreateFodder, PatchFodder} from "./requests/FodderRequests";
import {FodderDocument} from "../models/Fodder";

@JsonController('/fodders')
export class FodderController {

    constructor(
        private fodderService: FodderService
    ) {
    }

    @Get()
    public async getAllFodder(): Promise<FodderDocument[]> {
        try {
            return await this.fodderService.getAllFodders()
        } catch (e) {
            throw new HttpError(500, e)
        }
    }

    @Post()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }] })
    public async createFodder(@Body() body: CreateFodder): Promise<FodderDocument> {
        try {
            return await this.fodderService.createNewFodder(body)
        } catch (e) {
            throw new HttpError(500, e)
        }
    }

    @Patch('/:id')
    @Authorized('admin')
    @OpenAPI({ security: [{ bearerAuth: [] }] })
    public async patchFodderById(@Param('id') id: string, @Body() body: PatchFodder): Promise<FodderDocument> {
        try {
            return this.fodderService.patchFodderById(id, body)
        } catch (e) {
            throw new Error(e)
        }
    }
}

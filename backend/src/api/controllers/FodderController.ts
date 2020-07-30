import {Authorized, Get, JsonController, Post} from "routing-controllers/index";
import {OpenAPI} from "routing-controllers-openapi";

@JsonController('/fodders')
export class FodderController {

    @Get()
    public async getAllFodder() {

    }

    @Post()
    @Authorized()
    @OpenAPI({ security: [{ bearerAuth: [] }] })
    public async createFodder() {

    }
}

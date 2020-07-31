import {HttpError} from "routing-controllers";

export class InternalErrorResponse extends HttpError {
    constructor(e: any) {
        super(500, `Internal server error: ${e}`);
    }
}

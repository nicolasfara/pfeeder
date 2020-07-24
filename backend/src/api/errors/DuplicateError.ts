import {HttpError} from "routing-controllers";

export class DuplicateError extends HttpError {
    constructor() {
        super(409, `User already exist with that email`);
    }
}

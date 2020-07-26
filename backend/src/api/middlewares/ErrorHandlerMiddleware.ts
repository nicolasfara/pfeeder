import * as express from 'express';
import {ExpressErrorMiddlewareInterface, HttpError, Middleware} from 'routing-controllers';
import {env} from '../../env';

@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {

    public isProduction = env.isProduction;

    public error(error: HttpError, req: express.Request, res: express.Response, next: express.NextFunction): void {
        res.status(error.httpCode || 500);
        res.json({
            name: error.name,
            message: error.message,
            errors: error[`errors`] || [],
        });

        if (this.isProduction) {
            console.log(error.name, error.message);
        } else {
            console.log(error.name, error.stack);
        }
    }
}

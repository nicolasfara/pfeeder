import * as express from 'express';
import * as passport from 'passport';
import { ExpressMiddlewareInterface, UnauthorizedError } from 'routing-controllers';

export class JWTMiddleware implements ExpressMiddlewareInterface {
    constructor(
    ) { }

    // tslint:disable-next-line
    authenticate = (callback) => passport.authenticate('jwt', { session: false }, callback);

    use(req: express.Request, res: express.Response, next: express.NextFunction): Promise<passport.Authenticator> {
        return this.authenticate((err, user, info) => {
            if (err || !user) {
                console.log('Unauthorized access');
                console.log(info);
                return next(new UnauthorizedError(info));
            }

            req.user = user;
            return next();
        })(req, res, next);
    }
}

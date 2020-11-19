import {Application} from 'express';
import {Action, createExpressServer} from 'routing-controllers';
import jwt from 'jsonwebtoken';
import {User} from '../api/models/User';
import {env} from '../env';
import "reflect-metadata";
import {Logger} from "../lib/logger";

export default async (): Promise<Application> => {
    const logger = new Logger('Express server')

    logger.info("Creating the server")
    logger.info(env.app.dirs.controllers[0])
    /**
     * We create a new express server instance.
     * We could have also use useExpressServer here to attach controllers to an existing express instance.
     */
    return createExpressServer({
        cors: true,
        classTransformer: true,
        routePrefix: env.app.routePrefix,
        defaultErrorHandler: false,
        classToPlainTransformOptions: {excludePrefixes: ['_']},
        /**
         * We can add options about how routing-controllers should configure itself.
         * Here we specify what controllers should be registered in our express server.
         */
        controllers: env.app.dirs.controllers,
        middlewares: env.app.dirs.middlewares,
        interceptors: env.app.dirs.interceptors,
        currentUserChecker: async (action: Action, value?: any) => {
            const token = action.request.headers.authorization.split(' ')[1];
            try {
                const decoded: any = jwt.verify(token, env.app.jwtSecret);
                return await User.findById(decoded.id);
            } catch (e) {
                return undefined;
            }
        },
        authorizationChecker: async (action: Action, roles?: string[]) => {
            const token = action.request.headers.authorization.split(' ')[1];
            try {
                const decoded: any = jwt.verify(token, env.app.jwtSecret);
                const user = await User.findById(decoded.id);
                if (user && !roles.length) return true;
                return !!(user && roles.find(role => user.role.indexOf(role) !== -1));
            } catch (e) {
                return false;
            }
        }
    });
}


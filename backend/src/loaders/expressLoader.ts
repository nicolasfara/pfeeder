import {Application} from 'express';
import {MicroframeworkLoader, MicroframeworkSettings} from 'microframework';
import {Action, createExpressServer} from 'routing-controllers';
import jwt from 'jsonwebtoken';
import {User} from '../api/models/User';

import {env} from '../env';

export const expressLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
        /**
         * We create a new express server instance.
         * We could have also use useExpressServer here to attach controllers to an existing express instance.
         */
        const expressApp: Application = createExpressServer({
            cors: true,
            classTransformer: true,
            routePrefix: env.app.routePrefix,
            defaultErrorHandler: false,
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

        // Run application to listen on given port
        if (!env.isTest) {
            const server = expressApp.listen(env.app.port);
            settings.setData('express_server', server);
        }

        // Here we can set the data for other loaders
        settings.setData('express_app', expressApp);
    }
};

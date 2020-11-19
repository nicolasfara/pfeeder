import {validationMetadatasToSchemas} from 'class-validator-jsonschema';
import basicAuth from 'express-basic-auth';
import {getMetadataArgsStorage} from 'routing-controllers';
import {routingControllersToSpec} from 'routing-controllers-openapi';
import * as swaggerUi from 'swagger-ui-express';
import express, {Application} from 'express';

import {env} from '../env';
import {Logger} from "../lib/logger";

export default async (expressApp: Application) => {
    const logger = new Logger('Swagger')
    logger.info("Create swagger instance")
    if (env.swagger.enabled) {
        const schemas = validationMetadatasToSchemas({
            refPointerPrefix: '#/components/schemas/'
        })

        const swaggerFile = routingControllersToSpec(
            getMetadataArgsStorage(),
            {},
            {
                components: {
                    schemas,
                    securitySchemes: {
                        basicAuth: {
                            type: 'http',
                            scheme: 'basic',
                        },
                        bearerAuth: {
                            type: 'http',
                            scheme: 'bearer',
                            bearerFormat: 'JWT'
                        },
                    },
                },
            }
        );

        // Add npm infos to the swagger doc
        swaggerFile.info = {
            title: env.app.name,
            description: env.app.description,
            version: env.app.version,
        };

        swaggerFile.servers = [
            {
                url: `${env.app.schema}://${env.app.host}:${env.app.port}${env.app.routePrefix}`,
            },
        ];

        expressApp.use(
            env.swagger.route,
            env.swagger.username ? basicAuth({
                users: {
                    [`${env.swagger.username}`]: env.swagger.password,
                },
                challenge: true,
            }) : (req: express.Request, res: express.Response, next: express.NextFunction) => next(),
            swaggerUi.serve,
            swaggerUi.setup(swaggerFile)
        );
    }
};

import * as dotenv from 'dotenv';
import * as path from 'path';

import * as pkg from '../package.json';
import {
    getOsEnv,
    getOsEnvArray,
    getOsEnvOptional,
    getOsPaths,
    getPaths,
    normalizePort,
    toBool,
    toNumber
} from './lib/env';

/**
 * Load .env file or for tests the .env.test file.
 */
dotenv.config({ path: path.join(process.cwd(), `.env${((process.env.NODE_ENV === 'test') ? '.test' : '')}`) });

/**
 * Environment variables
 */
export const env = {
    node: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    isDevelopment: process.env.NODE_ENV === 'development',
    app: {
        name: getOsEnvOptional('APP_NAME') || 'pfeeder',
        version: (pkg as any).version,
        description: (pkg as any).description,
        host: getOsEnvOptional('APP_HOST') || 'localhost',
        schema: getOsEnvOptional('APP_SCHEMA') || 'http',
        routePrefix: getOsEnvOptional('APP_ROUTE_PREFIX') || '/api',
        port: normalizePort(process.env.PORT || getOsEnvOptional('APP_PORT') || '3000'),
        banner: toBool(getOsEnvOptional('APP_BANNER')) || true,
        jwtSecret: getOsEnvOptional('JWT_SECRET') || 'JWT_SECRET',
        mqttUri: getOsEnvOptional('MQTT_URI') || 'mqtt://mosquitto',
        mqttAlert: getOsEnvOptional('MQTT_ALERT') || '/pfeeder/alert',
        mqttInfo: getOsEnvOptional('MQTT_INFO') || '/pfeeder/info',
        mqttStatus: getOsEnvOptional('MQTT_STATUS') || '/pfeeder/status',
        mqttFeed: getOsEnvOptional('MQTT_FEED') || '/pfeeder/feed',
        redisPort: getOsEnvOptional('REDIS_PORT') || 6379,
        redisHost: getOsEnvOptional('REDIS_HOST') || 'redis',
        dirs: {
            controllers: getPaths(getOsEnvArray('CONTROLLERS')),
            middlewares: getOsPaths('MIDDLEWARES'),
            interceptors: getOsPaths('INTERCEPTORS'),
        },
    },
    log: {
        level: getOsEnv('LOG_LEVEL'),
        json: toBool(getOsEnvOptional('LOG_JSON')),
        output: getOsEnv('LOG_OUTPUT'),
    },
    db: {
        host: getOsEnvOptional('MONGO_HOST') || 'mongo',
        port: toNumber(getOsEnvOptional('MONGO_PORT')) || 27017,
        username: getOsEnvOptional('MONGO_USERNAME'),
        password: getOsEnvOptional('MONGO_PASSWORD'),
        database: getOsEnvOptional('MONGO_DATABASE') || 'pfeeder',
    },
    swagger: {
        enabled: toBool(getOsEnv('SWAGGER_ENABLED')),
        route: getOsEnv('SWAGGER_ROUTE'),
        username: getOsEnv('SWAGGER_USERNAME'),
        password: getOsEnv('SWAGGER_PASSWORD'),
    },
    monitor: {
        enabled: toBool(getOsEnv('MONITOR_ENABLED')),
        route: getOsEnv('MONITOR_ROUTE'),
        username: getOsEnv('MONITOR_USERNAME'),
        password: getOsEnv('MONITOR_PASSWORD'),
    },
};

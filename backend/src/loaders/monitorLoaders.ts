import basicAuth from 'express-basic-auth';
import monitor from 'express-status-monitor';

import { env } from '../env';
import {Application} from "express";
import {Logger} from "../lib/logger";

export default async (expressApp: Application) => {
    const logger = new Logger('Monitor')
    if (env.monitor.enabled) {
        logger.info("Monitor create")
        expressApp.use(monitor());
        expressApp.get(
            env.monitor.route,
            env.monitor.username ? basicAuth({
                users: {
                    [`${env.monitor.username}`]: env.monitor.password,
                },
                challenge: true,
            }) : (req, res, next) => next(),
            monitor().pageRoute
        );
    }
};

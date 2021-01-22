import mongoose from 'mongoose';

import {env} from '../env';
import {Logger} from "../lib/logger";

export default async (): Promise<void> => {
    const logger = new Logger('Mongoose driver')
    try {
        logger.info("Attempt to connect to DB")
        const username = env.db.username
        const password = env.db.password
        let userPass = ""
        if (username && password) userPass = username + ":" + password + "@"
        const connectionString = `mongodb://${userPass}${env.db.host}:${env.db.port}/${env.db.database}`
        logger.info("Connection at: " + connectionString)
        const connection = await mongoose.connect(connectionString,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true
            });
        if (!connection) logger.error("Unable to connect to DB")
        else logger.info("Connection succeeded")
    } catch (e) {
        logger.error("Unable to connect to mongodb: " + e)
    }
}

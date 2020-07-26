import {MicroframeworkLoader, MicroframeworkSettings} from "microframework";
import mongoose from 'mongoose';

import { env } from '../env';

export const mongooseLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
        try {
            const mongooseConnection = await mongoose.connect(
                `mongodb://${env.db.username}:${env.db.password}@${env.db.host}:${env.db.port}/${env.db.database}`,
                {
                    useNewUrlParser: true,
                    useCreateIndex: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false
                }
            )
            console.log(`Connection to ${env.db.database} succeeded`);
            settings.setData('mongoose', mongooseConnection);
        } catch (e) {
            console.log("Error on DB connection: ", e);
        }
    }
}

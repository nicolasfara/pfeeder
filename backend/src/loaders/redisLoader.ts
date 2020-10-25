import {MicroframeworkLoader, MicroframeworkSettings} from "microframework";
import * as redis from "redis";
import {Logger} from "../lib/logger";
import {env} from "../env";

export let redisClient: any

export const redisLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
        const log = new Logger()
        redisClient = redis.createClient(Number(env.app.redisPort), env.app.redisHost)
        if (redisClient) log.info("Redis connection succeeded")
    }
}

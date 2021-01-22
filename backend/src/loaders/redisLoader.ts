import * as redis from "redis";
import {Logger} from "../lib/logger";
import {env} from "../env";

export let redisClient: any

export default async () => {
    const log = new Logger('Redis driver')
    redisClient = redis.createClient(Number(env.app.redisPort), env.app.redisHost)
    if (redisClient) log.info("Redis connection succeeded")
}

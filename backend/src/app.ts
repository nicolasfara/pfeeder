import {bootstrapMicroframework} from "microframework";
import {expressLoader} from "./loaders/expressLoader";
import {mongooseLoader} from "./loaders/mongooseLoader";
import {swaggerLoader} from "./loaders/swaggerLoader";
import {iocLoader} from "./loaders/iocLoader";
import {winstonLoader} from "./loaders/winstonLoader";
import {monitorLoader} from "./loaders/monitorLoaders";
import {mqttLoader} from "./loaders/mqttLoader";
import {Logger} from "./lib/logger";
import {socketLoader} from "./loaders/socketLoader";
import {redisLoader} from "./loaders/redisLoader";

const log = new Logger()

bootstrapMicroframework([
    winstonLoader,
    mongooseLoader,
    expressLoader,
    redisLoader,
    socketLoader,
    swaggerLoader,
    iocLoader,
    monitorLoader,
    mqttLoader
])
    .then(() => log.info("Application is up and running."))
    .catch(error => log.error("Application is crashed: " + error.stack));

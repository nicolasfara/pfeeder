import {bootstrapMicroframework} from "microframework";
import {expressLoader} from "./loaders/expressLoader";
import {mongooseLoader} from "./loaders/mongooseLoader";
import {swaggerLoader} from "./loaders/swaggerLoader";
import {iocLoader} from "./loaders/iocLoader";
import {winstonLoader} from "./loaders/winstonLoader";
import {monitorLoader} from "./loaders/monitorLoaders";
import {mqttLoader} from "./loaders/mqttLoader";

bootstrapMicroframework([
    mongooseLoader,
    expressLoader,
    swaggerLoader,
    iocLoader,
    winstonLoader,
    monitorLoader,
    mqttLoader
])
    .then(() => console.log("Application is up and running."))
    .catch(error => console.log("Application is crashed: " + error.stack));

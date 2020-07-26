import {bootstrapMicroframework} from "microframework";
import {expressLoader} from "./loaders/expressLoader";
import {mongooseLoader} from "./loaders/mongooseLoader";
import {swaggerLoader} from "./loaders/swaggerLoader";
import {iocLoader} from "./loaders/iocLoaders";
import {winstonLoader} from "./loaders/winstonLoader";

bootstrapMicroframework([
    mongooseLoader,
    expressLoader,
    swaggerLoader,
    iocLoader,
    winstonLoader
])
    .then(() => console.log("Application is up and running."))
    .catch(error => console.log("Application is crashed: " + error));

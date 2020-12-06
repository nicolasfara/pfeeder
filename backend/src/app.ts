import {env} from "./env";
import "reflect-metadata"; // this shim is required
import expressLoader from "./loaders/expressLoader";
import mongooseLoader from "./loaders/mongooseLoader";
import winstonLoader from "./loaders/winstonLoader";
import iocLoader from "./loaders/iocLoader";
import redisLoader from "./loaders/redisLoader";
import swaggerLoader from "./loaders/swaggerLoader";
import monitorLoaders from "./loaders/monitorLoaders";
import mqttLoader from "./loaders/mqttLoader";
// import {Logger} from "./lib/logger";
import socketLoader from "./loaders/socketLoader";

(async () => {
    // const log = new Logger('Entrypoint')

    // *****************************************************************************************************************
    // Express server creation
    await winstonLoader()
    // *****************************************************************************************************************

    // *****************************************************************************************************************
    // Setup mongoose driver
    await mongooseLoader();
    // *****************************************************************************************************************

    // *****************************************************************************************************************
    // Express server creation
    const app = await expressLoader();
    // *****************************************************************************************************************

    // *****************************************************************************************************************
    // Setup redis driver
    await redisLoader()
    // *****************************************************************************************************************

    // *****************************************************************************************************************
    // Setup redis driver
    await swaggerLoader(app)
    // *****************************************************************************************************************

    // *****************************************************************************************************************
    // Setup routing-controllers to use typedi container
    await iocLoader()
    // *****************************************************************************************************************

    // *****************************************************************************************************************
    // Setup monitor controller
    await monitorLoaders(app)
    // *****************************************************************************************************************

    // *****************************************************************************************************************
    // Setup mqtt driver
    await mqttLoader()
    // *****************************************************************************************************************

    const server = app.listen(3000 || env.app.port)
    await socketLoader(server)

})();

import {env} from "./env";
import expressLoader from "./loaders/expressLoader";
import mongooseLoader from "./loaders/mongooseLoader";
import winstonLoader from "./loaders/winstonLoader";
import iocLoader from "./loaders/iocLoader";
import redisLoader from "./loaders/redisLoader";
import socketLoader from "./loaders/socketLoader";
import swaggerLoader from "./loaders/swaggerLoader";
import monitorLoaders from "./loaders/monitorLoaders";
import mqttLoader from "./loaders/mqttLoader";
import {Logger} from "./lib/logger";

(async () => {
    const log = new Logger('Entrypoint')

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
    const expressApp = await expressLoader();
    // *****************************************************************************************************************

    // *****************************************************************************************************************
    // Setup redis driver
    await redisLoader()
    // *****************************************************************************************************************

    // *****************************************************************************************************************
    // Setup redis driver
    await swaggerLoader(expressApp)
    // *****************************************************************************************************************

    // *****************************************************************************************************************
    // Setup routing-controllers to use typedi container
    await iocLoader()
    // *****************************************************************************************************************

    // *****************************************************************************************************************
    // Setup monitor controller
    await monitorLoaders(expressApp)
    // *****************************************************************************************************************

    // *****************************************************************************************************************
    // Setup mqtt driver
    await mqttLoader()
    // *****************************************************************************************************************

    const server = expressApp.listen(3000 || env.app.port, async () => {
        log.info(`Server started on port ${3000 || env.app.port}`)
    })

    // *****************************************************************************************************************
    // Setup redis driver
    await socketLoader(server)
    // *****************************************************************************************************************
})();

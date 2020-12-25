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
import express from "express";

(async () => {
    // const log = new Logger('Entrypoint')

    // *****************************************************************************************************************
    // Express server creation
    await winstonLoader()
    const exp = express()
    const app = require("http").Server(exp)
    const io = require("socket.io")(app)
    // *****************************************************************************************************************

    // *****************************************************************************************************************
    // Setup mongoose driver
    await mongooseLoader();
    // *****************************************************************************************************************

    // *****************************************************************************************************************
    // Express server creation
    const expSwagger = await expressLoader(exp);
    // *****************************************************************************************************************

    // *****************************************************************************************************************
    // Setup redis driver
    await redisLoader()
    // *****************************************************************************************************************

    // *****************************************************************************************************************
    // Setup redis driver
    await swaggerLoader(expSwagger)
    // *****************************************************************************************************************

    // *****************************************************************************************************************
    // Setup routing-controllers to use typedi container
    await iocLoader()
    // *****************************************************************************************************************

    // *****************************************************************************************************************
    // Setup monitor controller
    await monitorLoaders(expSwagger)
    // *****************************************************************************************************************

    // *****************************************************************************************************************
    // Setup mqtt driver
    await mqttLoader()
    // *****************************************************************************************************************

    await socketLoader(io)
    app.listen(3000 || env.app.port)

})();

import {useSocketServer} from "socket-controllers";
import {Logger} from "../lib/logger";
import {SocketManager} from "../api/socket/SocketManager";
import {env} from "../env";
import Server = require("socket.io");

export let ws: any

export default async (expressServer: any) => {
    const log = new Logger('Socket.io driver')

    log.info("Create socket.io instance")
    const io = new Server(expressServer);
    const redis = require('socket.io-redis')
    io.adapter(redis({ host: env.app.redisHost, port: env.app.redisPort }));

    log.info("Bind socket.io to express server")

    ws = useSocketServer(expressServer, {
        controllers: [SocketManager]
    })
    log.info("socket.io driver started")
}

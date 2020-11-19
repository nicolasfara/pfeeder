import {useSocketServer} from "socket-controllers";
import {Logger} from "../lib/logger";
import {SocketManager} from "../api/socket/SocketManager";
import {env} from "../env";
import {User} from "../api/models/User";
import wsJwt from 'socketio-jwt-auth';
import {Server} from "http";

export let ws: any

export default async (expressServer: Server) => {
    const log = new Logger('Socket.io driver')

    log.info("Create socket.io instance")
    const io = require('socket.io')(expressServer);
    useSocketServer(io, {
        controllers: [SocketManager]
    });

    log.info("Bind socket.io to express server")
    io.use(wsJwt.authenticate({
        secret: env.app.jwtSecret
    }, async (payload, done) => {
        const user = await User.findById(payload.id)
        if (user) {
            log.info("User found, socket authenticated")
            return done(null, user)
        } else {
            log.error("User not exist")
            return done(null, false, 'User not exist')
        }

    }))
    ws = io
    log.info("socket.io driver started")
}

import {useSocketServer} from "socket-controllers";
import {Logger} from "../lib/logger";
import {SocketManager} from "../api/socket/SocketManager";
import {Server} from "http";
import {createParamDecorator} from "routing-controllers";
import {Application} from "express";
import {env} from "../env";
import {User} from "../api/models/User";
import * as wsJwt from 'socketio-jwt-auth'

export let ws: any

export default async (expressServer: Server, app: Application) => {
    const log = new Logger('Socket.io driver')

    log.info("Create socket.io instance")
    const io = require('socket.io')(expressServer);

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

    useSocketServer(io, {
        controllers: [SocketManager]
    });

    ws = io
    log.info("socket.io driver started")
}

export function socket(options?: { required?: boolean }) {
    return createParamDecorator({
        required: options && options.required,
        value: (action) => {
            if (action.request.app) {
                return action.request.app.get('socketio');
            }
            return undefined;
        }
    });
}

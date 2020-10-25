import {MicroframeworkLoader, MicroframeworkSettings} from "microframework";
import {useSocketServer} from "socket-controllers";
import {Logger} from "../lib/logger";
import {SocketManager} from "../api/socket/SocketManager";
import {env} from "../env";
import {User} from "../api/models/User";
// tslint:disable-next-line:no-var-requires
const wsJwt = require('socketio-jwt-auth')

export let ws: any

export const socketLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    const log = new Logger()
    if (settings) {
        const io = require('socket.io')(settings.getData('express_server'));
        useSocketServer(io, {
            controllers: [SocketManager]
        });
        log.info("Socket created")
        io.use(wsJwt.authenticate({
            secret: env.app.jwtSecret
        }, async (payload, done) => {
            const user = await User.findById(payload.id)
            if (user) return done(null, user)
            else return done(null, false, 'User not exist')

        }))
        ws = io
        settings.setData("websocket", io)
    }
}

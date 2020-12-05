import {useSocketServer} from "socket-controllers";
import {Logger} from "../lib/logger";
import {SocketManager} from "../api/socket/SocketManager";
import {Server} from "http";
import {Application} from "express";
import {env} from "../env";
import * as passportJwtSocketIo from 'passport-jwt.socketio'
import {ExtractJwt} from "passport-jwt";
import {User} from "../api/models/User";
import socketio from 'socket.io';

const options = {
    jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
    secretOrKey: env.app.jwtSecret
}

export let ws: any

export default async (expressServer: Server, app: Application) => {
    const log = new Logger('Socket.io driver')

    log.info("Create socket.io instance")
    const io = socketio(expressServer);

    log.info("Bind socket.io to express server")
    io.use(passportJwtSocketIo.authorize(options, async (jwtPayload, done) => {
        const user = await User.findById(jwtPayload.id)
        if (user) {
            log.info("User found!")
            return done(null, user)
        }
        else {
            log.error("User not found")
            done(null, false, "User not found")
        }
    }))
    /*io.use((socket, next) => {
        if (socket.handshake.query && socket.handshake.query.auth_token){
            jwt.verify(socket.handshake.query.auth_token, env.app.jwtSecret, (err, decoded) => {
                if (err) {
                    log.error("Error on decode token")
                    return next(new Error('Authentication error'));
                }
                log.info("Ok")
                socket.user = decoded;
                next();
            });
        }
        else {
            log.info("Dio merda")
            next(new Error('Authentication error'));
        }
    })*/
    /*io.use(wsJwt.authenticate({
        secret: env.app.jwtSecret,
        algorithm: 'HS256',
        succeedWithoutToken: true
    }, (payload, done) => {
        User.findById(payload.id, (err, user) =>{
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, "User not exist")
            }
            return done(null, user)
        })
    }))*/

    useSocketServer(io, {
        controllers: [SocketManager]
    });

    ws = io
    log.info("socket.io driver started")
}

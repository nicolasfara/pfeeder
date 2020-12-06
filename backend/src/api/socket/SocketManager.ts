import {
    ConnectedSocket, MessageBody,
    OnConnect,
    OnDisconnect, OnMessage,
    SocketController
} from "socket-controllers";
import {Logger} from "../../lib/logger";
import {Socket} from "socket.io";
import {redisClient} from "../../loaders/redisLoader";
import jwt from 'jsonwebtoken'
import {env} from "../../env";

@SocketController()
export class SocketManager {
    private log = new Logger()

    @OnConnect()
    connection(@ConnectedSocket() socket: Socket) {
        this.log.info("New Connection")
        socket.emit("connection", { text: "Hello this is message" })
    }

    @OnMessage('authentication')
    authentication(@ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        if (message.token) {
            const token = message.token
            jwt.verify(token, env.app.jwtSecret, (err, decoded) => {
                if (err) this.log.error("Error on token decode")
                else {
                    redisClient.sadd(`${decoded.email}`, `${socket.id}`)
                    redisClient.smembers(decoded.email, (errRedis, values: string[]) => {
                        if (errRedis) this.log.error(errRedis)
                        this.log.info(`The user ${decoded.email} has: ${values}`)
                    })
                }
            })
        }
    }

    @OnDisconnect()
    disconnect(@ConnectedSocket() socket: any) {
        this.log.info('client disconnected');
        redisClient.srem(`${socket.handshake.user.email}`, `${socket.id}`)
        redisClient.smembers(socket.handshake.user.email, (err, values: string[]) => {
            if (err) this.log.error(err)
            this.log.info(`The user ${socket.handshake.user.email} has: ${values}`)
        })
        this.log.info(`Remove socket id ${socket.handshake.user._id} from redis`)
    }
}


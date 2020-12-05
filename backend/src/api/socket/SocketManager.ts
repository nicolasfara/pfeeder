import {ConnectedSocket, OnConnect, OnDisconnect, SocketController} from "socket-controllers";
import {Logger} from "../../lib/logger";
import {redisClient} from "../../loaders/redisLoader";

@SocketController()
export class SocketManager {
    private log = new Logger()

    @OnConnect()
    connection(@ConnectedSocket() socket: any) {
        this.log.info("New Connection")
        redisClient.sadd(`${socket.handshake.user.email}`, `${socket.id}`)
        this.log.info("Add new socket id for user: " + socket.handshake.user.email)
        redisClient.smembers(socket.handshake.user.email, (err, values: string[]) => {
            if (err) this.log.error(err)
            this.log.info(`The user ${socket.handshake.user.email} has: ${values}`)
        })
        socket.emit("connection", { text: "Hello this is message" })
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

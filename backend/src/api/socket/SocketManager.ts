import {ConnectedSocket, MessageBody, OnConnect, OnDisconnect, OnMessage, SocketController} from "socket-controllers";
import {Logger} from "../../lib/logger";
import {redisClient} from "../../loaders/redisLoader";

@SocketController()
export class SocketManager {
    private log = new Logger()

    @OnConnect()
    connection(@ConnectedSocket() socket: any) {
        this.log.info("New Connection")
        redisClient.set(`${socket.request.user._id}`, socket.id)
        this.log.info("Add new record on redis with key: " + socket.request.user._id)
        socket.emit("connection", { text: "Hello this is message" })
    }

    @OnDisconnect()
    disconnect(@ConnectedSocket() socket: any) {
        this.log.info('client disconnected');
    }

    @OnMessage('save')
    save(@ConnectedSocket() socket: any, @MessageBody() message: any) {
        this.log.info('received message:', message);
        this.log.info('setting id to the message and sending it back to the client');
        message.id = 1;
        socket.emit('message_saved', message);
    }
}

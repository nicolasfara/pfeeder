import {ConnectedSocket, MessageBody, OnConnect, OnDisconnect, OnMessage, SocketController} from "socket-controllers";
import {Logger} from "../../lib/logger";
import {ws} from "../../loaders/socketLoader";

@SocketController()
export class SocketManager {
    private log = new Logger()

    @OnConnect()
    connection(@ConnectedSocket() socket: any) {
        this.log.info("New Connection")
        socket.emit("connection", { text: "Hello this is message" })
        ws.of('pippo').emit('pippo', { text: "Hello world" })
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

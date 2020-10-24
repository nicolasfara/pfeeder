import {MicroframeworkLoader, MicroframeworkSettings} from "microframework";
import {createSocketServer} from "socket-controllers";
import {SocketManager} from "../api/socket/SocketManager";
import {Logger} from "../lib/logger";

export const socketLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    const log = new Logger()
    if (settings) {
        createSocketServer(3001, {
            controllers: [SocketManager],
        });
        log.info("Socket created")
    }
}

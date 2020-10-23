import {MicroframeworkLoader, MicroframeworkSettings} from "microframework";
import {connect} from "mqtt"
import "reflect-metadata"
import {Container} from "typedi"

import {env} from "../env"
import {MqttService} from "../api/service/MqttService";
import {Logger} from "../lib/logger";

export const client = connect(env.app.mqttUri)

export const mqttLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    const mqttService = Container.get(MqttService)
    const log = new Logger()
    if (settings) {
        if (client) {
            log.info("Connection successfully")
            settings.setData('mqttClient', client)

            client.on('connect', () => {
                client.subscribe(env.app.mqttInfo, (err) => {
                    if (!err) {
                        log.info("Subscribe to server topic")
                    }
                })
                client.subscribe(env.app.mqttAlert, (err) => {
                    if (!err) {
                        log.info("Subscribe to server topic")
                    }
                })
                client.subscribe(env.app.mqttStatus, (err) => {
                    if (!err) {
                        log.info("Subscribe to server topic")
                    }
                })
            })

            client.on('message', async (topic, message) => {
                log.info(`From topic ${topic}, message: ${message.toString()}`)
                switch (topic) {
                    case env.app.mqttStatus:
                        const addStatus = await mqttService.addStatusNotification(message)
                        if (!addStatus) {
                            log.error("Unable to save the new status")
                        }
                        // TODO send via WebSocket a message for the fail
                        break
                    case env.app.mqttAlert:
                        const addAlert = await mqttService.addAlertNotification(message)
                        if (!addAlert) {
                            log.error("Unable to save the alert")
                        }
                        // TODO send via WebSocket a message for the fail
                        break
                    case env.app.mqttInfo:
                        const addNotRes = await mqttService.addInfoNotification(message)
                        if (!addNotRes) {
                            log.error("Unable to save a new notification")
                        }
                        // TODO send via WebSocket a message for the fail
                        break
                    default:
                        log.error("Error")
                }
            })
        } else {
            log.error("Connection to MQTT middleware failed")
        }
    }
}

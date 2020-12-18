import {connect} from "mqtt"
import "reflect-metadata"
import {Container} from "typedi"

import {env} from "../env"
import {MqttService} from "../api/service/MqttService";
import {Logger} from "../lib/logger";

export let client: any

export default async () => {
    const mqttService = Container.get(MqttService)
    const log = new Logger('MQTT driver')

    log.info(`Try connecting to: ${env.app.mqttUri}`)
    client = connect(env.app.mqttUri)
    if (client) {
        log.info("Connection successfully")

        client.on('connect', () => {
            client.subscribe(env.app.mqttInfo, (err) => {
                if (!err) {
                    log.info("Subscribe to server topic: " + env.app.mqttInfo)
                } else {
                    log.error("Failed to subscribe to the topic: " + err)
                }
            })
            client.subscribe(env.app.mqttAlert, (err) => {
                if (!err) {
                    log.info("Subscribe to server topic: " + env.app.mqttAlert)
                } else {
                    log.error("Failed to subscribe to the topic: " + err)
                }
            })
            client.subscribe(env.app.mqttStatus, (err) => {
                if (!err) {
                    log.info("Subscribe to server topic: " + env.app.mqttStatus)
                } else {
                    log.error("Failed to subscribe to the topic: " + err)
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
                    break
                case env.app.mqttAlert:
                    const addAlert = await mqttService.addAlertNotification(message)
                    if (!addAlert) {
                        log.error("Unable to save the alert")
                    }
                    break
                case env.app.mqttInfo:
                    const addNotRes = await mqttService.addInfoNotification(message)
                    if (!addNotRes) {
                        log.error("Unable to save a new notification")
                    }
                    break
                case env.app.mqttFeed:
                    const addFeed = await mqttService.addFeed(message)
                    if (!addFeed) {
                        log.error("Unable to save a new feed")
                    }
                    break
                default:
                    log.error("Error")
            }
        })
    } else {
        log.error("Connection to MQTT middleware failed")
    }
}

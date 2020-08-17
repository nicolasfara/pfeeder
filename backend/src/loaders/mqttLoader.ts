import {MicroframeworkLoader, MicroframeworkSettings} from "microframework";
import {connect} from "mqtt"

import {env} from "../env"

export const mqttLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
        const client = connect(env.app.mqttUri)
        if (client) {

            settings.setData('mqttClient', client)
        }
    }
}

export interface MessageStatus {
    deviceId: string,
    ration: number
}

export interface GeneralMessage {
    deviceId: string,
    message: string
}

export interface FeedMessage {
    deviceId: string,
    petName: string,
    quantity: number,
    kcal: number,
    fodderId: string
}

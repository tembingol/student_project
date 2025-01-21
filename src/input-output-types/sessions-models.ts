import { ObjectId } from "mongodb"

export type SessionViewModel = {
    id: string,
    user_id: string,
    device_id: string,
    device_name: string,
    ip: string,
    iat: Date,
    exp: Date,
}

export type SessionDataBaseModel = {
    _id?: ObjectId
    user_id: string,
    device_id: string,
    device_name: string,
    ip: string,
    iat: Date,
    exp: Date,
}

export type SessionResponseMetadataModel = {
    deviceId: string,
    accessToken: string,
    refreshToken: string,
}


export type IncomingRequestsModel = {
    Ip: string,
    URL: string,
    Date: Date
}

export type IncomingRequestsDataBaseModel = {
    _id?: ObjectId
    Ip: string,
    URL: string,
    Date: Date
}

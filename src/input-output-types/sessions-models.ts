import { ObjectId, WithId } from "mongodb"
import mongoose from "mongoose"
import { SETTINGS } from "../settings"

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

const IncomingRequestsSchema = new mongoose.Schema<WithId<IncomingRequestsModel>>({
    Ip: { type: String, required: true },
    URL: { type: String, required: true },
    Date: { type: Date, required: true, default: new Date() }
})

export const IncomingRequestsModel12 = mongoose.model<WithId<IncomingRequestsModel>>(SETTINGS.INCOMINGREQUESTS_COLLECTION_NAME, IncomingRequestsSchema)

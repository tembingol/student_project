import { WithId } from "mongodb"
import mongoose from "mongoose"
import { SETTINGS } from "../settings"

export type DeviceViewModel = {
    ip: string,//IP address of device during signing in
    title: string,//Device name: for example Chrome 105 (received by parsing http header "user-agent")
    lastActiveDate: Date,//Date of the last generating of refresh/access tokens
    deviceId: string,//Id of connected device session
}

const SevvionDeviceSchema = new mongoose.Schema<WithId<DeviceViewModel>>({
    ip: { type: String, required: true },
    title: { type: String, required: false },
    lastActiveDate: { tepe: Date, required: true, default: new Date() },
    deviceId: { type: String, required: true }

})

export const SessionDeviceModel = mongoose.model<WithId<DeviceViewModel>>(SETTINGS.SESSIONS_COLLECTION_NAME, SevvionDeviceSchema)
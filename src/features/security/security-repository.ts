import { ObjectId } from "mongodb"
import { sessionssCollection } from "../../db/mongodb"

export const securityRepository = {

    deleteAllDevices: async function (filter: {}) {
        const result = await sessionssCollection.deleteMany(filter)
        return result.deletedCount > 0
    },

    deleteDeviceByID: async function (deviceId: string) {
        const filter = { device_id: deviceId }
        const result = await sessionssCollection.deleteOne(filter)
        return result.deletedCount === 1
    },
}
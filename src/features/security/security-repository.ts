import { db } from "../../db/db.js"

export const securityRepository = {

    deleteAllDevices: async function (filter: {}) {
        const result = await db.getCollections().sessionssCollection.deleteMany(filter)
        return result.deletedCount > 0
    },

    deleteDeviceByID: async function (deviceId: string) {
        const filter = { device_id: deviceId }
        const result = await db.getCollections().sessionssCollection.deleteOne(filter)
        return result.deletedCount === 1
    },
}
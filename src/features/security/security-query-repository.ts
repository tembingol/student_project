import { db } from "../../db/db.js"

export const securityQueryRepository = {

    getAllDevices: async function (filter: any) {
        const allDevices = await db.getCollections().sessionssCollection.find(filter)
        return allDevices.toArray()
    },

    getDeviceByID: async function (filter: {}) {
        const foundUser = await db.getCollections().sessionssCollection.findOne(filter)
        return foundUser
    },

    getDocumetnsCount: async function (filter: {}) {
        return await db.getCollections().sessionssCollection.countDocuments(filter)
    },

}
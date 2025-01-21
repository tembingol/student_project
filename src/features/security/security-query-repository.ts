import { sessionssCollection } from "../../db/mongodb"

export const securityQueryRepository = {

    getAllDevices: async function (filter: any) {
        const allDevices = await sessionssCollection.find(filter)
        return allDevices.toArray()
    },

    getDeviceByID: async function (filter: {}) {
        const foundUser = await sessionssCollection.findOne(filter)
        return foundUser
    },

    getDocumetnsCount: async function (filter: {}) {
        return await sessionssCollection.countDocuments(filter)
    },

}
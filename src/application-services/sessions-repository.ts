import { ObjectId } from "mongodb"
import { db } from "../db/db"
import { IncomingRequestsDataBaseModel, SessionDataBaseModel } from "../input-output-types/sessions-models"

export const sessionsRepository = {

    addSession: async function (session: SessionDataBaseModel) {
        const insertResult = await db.getCollections().sessionssCollection.insertOne(session)
        return insertResult.insertedId.toString()
    },

    getSession: async function (filter: {}) {
        const foundSession = await db.getCollections().sessionssCollection.findOne(filter)
        return foundSession
    },

    //to-DO типизировать sessionData typeof SessionDataBaseModel
    updateSession: async function (sessionId: string, sessionData: any) {
        const filter = { _id: new ObjectId(sessionId) }
        const result = await db.getCollections().sessionssCollection.updateOne(filter, {
            $set: sessionData
        })

        return result.matchedCount === 1
    },

    addIncomingRequest: async function (incomingRequest: IncomingRequestsDataBaseModel) {
        const insertResult = await db.getCollections().incomingRequestsCollection.insertOne(incomingRequest)
        return insertResult.insertedId.toString()
    },

    deleteSession: async function (sessionId: string,) {
        const filter = { _id: new ObjectId(sessionId) }
        const result = await db.getCollections().sessionssCollection.deleteOne(filter)
        return result.deletedCount === 1
    },

    getDocumetnsCount: async function (filter: {}) {
        return await db.getCollections().sessionssCollection.countDocuments(filter)
    },

    getIncomingRequestsCount: async function (filter: {}) {
        return await db.getCollections().incomingRequestsCollection.countDocuments(filter)
    },

}

import { ObjectId } from "mongodb"
import { incomingRequestsCollection, sessionssCollection } from "../db/mongodb"
import { IncomingRequestsDataBaseModel, SessionDataBaseModel, SessionViewModel } from "../input-output-types/sessions-models"

export const sessionsRepository = {

    addSession: async function (session: SessionDataBaseModel) {
        const insertResult = await sessionssCollection.insertOne(session)
        return insertResult.insertedId.toString()
    },

    getSession: async function (filter: {}) {
        const foundSession = await sessionssCollection.findOne(filter)
        return foundSession
    },

    //to-DO типизировать sessionData typeof SessionDataBaseModel
    updateSession: async function (sessionId: string, sessionData: any) {
        const filter = { _id: new ObjectId(sessionId) }
        const result = await sessionssCollection.updateOne(filter, {
            $set: sessionData
        })

        return result.matchedCount === 1
    },

    addIncomingRequest: async function (incomingRequest: IncomingRequestsDataBaseModel) {
        const insertResult = await incomingRequestsCollection.insertOne(incomingRequest)
        return insertResult.insertedId.toString()
    },

    deleteSession: async function (sessionId: string,) {
        const filter = { _id: new ObjectId(sessionId) }
        const result = await sessionssCollection.deleteOne(filter)
        return result.deletedCount === 1
    },

    getDocumetnsCount: async function (filter: {}) {
        return await sessionssCollection.countDocuments(filter)
    },

    getIncomingRequestsCount: async function (filter: {}) {
        return await incomingRequestsCollection.countDocuments(filter)
    },

}

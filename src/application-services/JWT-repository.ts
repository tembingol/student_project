import { db } from "../db/db"
import { ExpiredTokensModel } from "../input-output-types/expired-tokens-models"

export const expiredTokensRepository = {

    createExpiredToken: async function (token: ExpiredTokensModel) {
        const insertResult = await db.getCollections().expiredTokensCollection.insertOne(token)
        return insertResult.insertedId.toString()
    },

    findExpiredToken: async function (token: string) {
        const filter = { token: token }
        const foundToken = await db.getCollections().expiredTokensCollection.findOne(filter)
        return foundToken
    },

}
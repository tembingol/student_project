import { ObjectId } from "mongodb"
import { db } from "../../db/db"
import { UserCredentialsModel, UserDataBaseModel } from "../../input-output-types/users-moduls"

export const usersRepository = {

    createUser: async function (user: UserDataBaseModel, usersCredentials: UserCredentialsModel) {
        const newObjectId = new ObjectId()

        const newUser: UserDataBaseModel = {
            ...user,
            _id: newObjectId,
        }

        //toDo transaction {
        const insetrCredentials = db.getCollections().usersCredentialsCollection.insertOne({
            ...usersCredentials,
            userId: newObjectId.toString()
        })

        const insertResult = await db.getCollections().usersCollection.insertOne(newUser)
        //toDo transaction }

        return insertResult.insertedId.toString()
    },

    deleteUser: async function (useriD: string) {
        const result = await db.getCollections().usersCollection.deleteOne({ _id: new ObjectId(useriD) })
        return result.deletedCount === 1
    },

    updateConfirmation: async function (useriD: string) {
        const filter = { _id: new ObjectId(useriD) }
        const result = await db.getCollections().usersCollection.updateOne(filter, { $set: { 'emailConfirmation.isConfirmed': true } })
        return result.modifiedCount === 1
    },

    updateConfirmationCode: async function (useriD: string, confirmationCode: string) {
        const filter = { _id: new ObjectId(useriD) }
        const result = await db.getCollections().usersCollection.updateOne(filter, { $set: { 'emailConfirmation.confirmationCode': confirmationCode } })
        return result.modifiedCount === 1
    },
}
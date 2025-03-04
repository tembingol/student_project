import { ObjectId } from "mongodb"
import { UserCredentialsModel, UserDataBaseModel } from "../../../input-output-types/users-moduls"
import { db } from "../../../db/db"


export class UsersRepository {

    async createUser(user: UserDataBaseModel, usersCredentials: UserCredentialsModel) {
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
    }

    async deleteUser(useriD: string) {
        const result = await db.getCollections().usersCollection.deleteOne({ _id: new ObjectId(useriD) })
        return result.deletedCount === 1
    }

    async updateConfirmation(useriD: string) {
        const filter = { _id: new ObjectId(useriD) }
        const result = await db.getCollections().usersCollection.updateOne(filter, { $set: { 'emailConfirmation.isConfirmed': true } })
        return result.modifiedCount === 1
    }

    async updateConfirmationCode(useriD: string, confirmationCode: string) {
        const filter = { _id: new ObjectId(useriD) }
        const result = await db.getCollections().usersCollection.updateOne(filter, { $set: { 'emailConfirmation.confirmationCode': confirmationCode } })
        return result.modifiedCount === 1
    }

    async updatePasswordRecoveryCode(useriD: string, passwordRecoveryCode: string) {
        const filter = { _id: new ObjectId(useriD) }
        const result = await db.getCollections().usersCredentialsCollection.updateOne(filter, { $set: { passwordRecoveryCode: passwordRecoveryCode } })
        return result.modifiedCount === 1
    }
}
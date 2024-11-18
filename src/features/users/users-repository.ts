import { ObjectId } from "mongodb"
import { usersCollection, usersCredentialsCollection } from "../../db/mongodb"
import { UserCredentialsModel, UserDataBaseModel, UserViewModel } from "../../input-output-types/users-moduls"

export const usersRepository = {

    createUser: async function (user: UserViewModel, usersCredentials: UserCredentialsModel) {
        const newObjectId = new ObjectId()

        const newUser: UserDataBaseModel = {
            ...user,
            _id: newObjectId,
            id: newObjectId.toString()
        }

        //toDo transaction {
        const insetrCredentials = usersCredentialsCollection.insertOne({
            ...usersCredentials,
            userId: newObjectId.toString()
        })

        const insertResult = await usersCollection.insertOne(newUser)
        //toDo transaction }

        return insertResult.insertedId.toString()
    },

    deleteUser: async function (useriD: string) {
        const result = await usersCollection.deleteOne({ id: useriD })
        return result.deletedCount === 1
    },

}
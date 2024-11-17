import { ObjectId } from "mongodb"
import { usersCollection } from "../../db/mongodb"
import { UserViewModel } from "../../input-output-types/users-moduls"

export const usersRepository = {

    createUser: async function (user: UserViewModel) {
        const newBObjectId = new ObjectId()
        user._id = newBObjectId
        user.id = newBObjectId.toString()

        const insertResult = await usersCollection.insertOne(user)
        return insertResult.insertedId.toString()
    },

    deleteUser: async function (useriD: string) {
        const result = await usersCollection.deleteOne({ id: useriD })
        return result.deletedCount === 1
    },

}
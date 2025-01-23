import { CommentDataBaseModel, CommentViewModel } from "../../input-output-types/comments-models"
import { db } from "../../db/db"
import { ObjectId } from "mongodb"


export const commentsRepository = {

    createComment: async function (postId: string, comment: CommentViewModel) {
        const newComment: CommentDataBaseModel = {
            ...comment,
            _id: new ObjectId(),
            postId: postId
        }

        const insertResult = await db.getCollections().commentsCollection.insertOne(newComment)

        return insertResult.insertedId.toString()
    },

    updateComment: async function (id: string, action: {}) {
        const filter = { _id: new ObjectId(id) }
        const result = await db.getCollections().commentsCollection.updateOne(filter, action)

        return result.matchedCount === 1
    },

    deleteComment: async function (id: string) {
        const filter = { _id: new ObjectId(id) }
        const result = await db.getCollections().commentsCollection.deleteOne(filter)

        return result.deletedCount === 1
    },

}
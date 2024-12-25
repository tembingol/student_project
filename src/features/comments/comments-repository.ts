import { CommentDataBaseModel, CommentInputModel, CommentViewModel } from "../../input-output-types/comments-models"
import { commentsCollection } from "../../db/mongodb"
import { ObjectId } from "mongodb"


export const commentsRepository = {

    createComment: async function (postId: string, comment: CommentViewModel) {
        const newComment: CommentDataBaseModel = {
            ...comment,
            _id: new ObjectId(),
            postId: postId
        }

        const insertResult = await commentsCollection.insertOne(newComment)

        return insertResult.insertedId.toString()
    },

    updateComment: async function (id: string, action: {}) {
        const filter = { _id: new ObjectId(id) }
        const result = await commentsCollection.updateOne(filter, action)

        return result.matchedCount === 1
    },

    deleteComment: async function (id: string) {
        const filter = { _id: new ObjectId(id) }
        const result = await commentsCollection.deleteOne(filter)

        return result.deletedCount === 1
    },

}
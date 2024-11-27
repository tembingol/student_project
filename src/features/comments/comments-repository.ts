import { CommentDataBaseModel, CommentInputModel, CommentViewModel } from "../../input-output-types/comments-models"
import { commentsCollection } from "../../db/mongodb"
import { ObjectId } from "mongodb"


export const commentsRepository = {

    createComment: async function (postId: string, comment: CommentViewModel) {
        const newObjectId = new ObjectId()
        const newComment: CommentDataBaseModel = {
            ...comment,
            _id: newObjectId,
            id: newObjectId.toString(),
            postId: postId
        }

        const insertResult = await commentsCollection.insertOne(newComment)

        return insertResult.insertedId.toString()
    },

    updateComment: async function (id: string, commentBody: CommentInputModel) {
        const result = await commentsCollection.updateOne({ id: id }, {
            $set: {
                content: commentBody.content,
            }
        })

        return result.matchedCount === 1
    },

    deleteComment: async function (id: string) {
        const result = await commentsCollection.deleteOne({ id: id })
        return result.deletedCount === 1
    },

}
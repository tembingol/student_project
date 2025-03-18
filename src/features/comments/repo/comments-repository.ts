
import { ObjectId } from "mongodb"
import { injectable } from "inversify"
import { CommentDataBaseModel, CommentViewModel } from "../../../input-output-types/comments-models"
import { db } from "../../../db/db"

@injectable()
export class CommentsRepository {

    async createComment(postId: string, comment: CommentViewModel) {
        const newComment: CommentDataBaseModel = {
            ...comment,
            _id: new ObjectId(),
            postId: postId
        }

        const insertResult = await db.getCollections().commentsCollection.insertOne(newComment)

        return insertResult.insertedId.toString()
    }

    async updateComment(id: string, action: {}) {
        const filter = { _id: new ObjectId(id) }
        const result = await db.getCollections().commentsCollection.updateOne(filter, action)

        return result.matchedCount === 1
    }

    async deleteComment(id: string) {
        const filter = { _id: new ObjectId(id) }
        const result = await db.getCollections().commentsCollection.deleteOne(filter)

        return result.deletedCount === 1
    }

}
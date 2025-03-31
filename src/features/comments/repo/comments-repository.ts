
import { ObjectId } from "mongodb"
import { injectable } from "inversify"
import { CommentModel, CommentViewModel } from "../../../input-output-types/comments-models"
import { db } from "../../../db/db"

@injectable()
export class CommentsRepository {

    async createComment(postId: string, comment: CommentViewModel) {
        const newComment: CommentViewModel = {
            ...comment,
            postId: postId
        }

        const createrdComm = await CommentModel.create(newComment)
        await createrdComm.save()
        if (!createrdComm) {
            return false
        }

        return createrdComm.id
    }

    async updateComment(id: string, content: string) {

        const foundComment = await CommentModel.findOne({ id: id }).exec()
        if (!foundComment) {
            return false
        }
        foundComment.content = content
        foundComment.markModified('content')
        await foundComment.save()
        return true
    }

    async deleteComment(id: string) {
        const result = await CommentModel.findOne({ id: id }).exec()
        if (!result) {
            return false
        }
        await result.deleteOne({ id: id })

        return result.$isDeleted
    }

}
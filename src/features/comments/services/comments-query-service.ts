import { CommentatorInfo, CommentDataBaseModel, CommentViewModel } from "../../../input-output-types/comments-models"
import { commentsQueryRepository } from "../comments-query-repository"
import { commentsServicesResponse } from "./comments-service"

export const commentsQueryService = {

    findCommentById: async function (id: string) {
        const result: commentsServicesResponse = {
            result: false,
            status: 404,
            data: {},
            errors: { errorsMessages: ["Not found"] }
        }
        const filter = { id: id }
        const foundComment = await commentsQueryRepository.getCommentByID(filter);

        if (foundComment) {
            result.result = true
            result.status = 200
            result.data = commentEntityMapper(foundComment)
            result.errors = { errorsMessages: [] }
        }

        return result
    },

}

export function commentEntityMapper(comment: CommentDataBaseModel,): CommentViewModel {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt,
    }
}
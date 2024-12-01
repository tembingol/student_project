import { CommentInputModel, CommentViewModel } from "../../../input-output-types/comments-models"
import { postsQueryService } from "../../posts/services/posts-query-service"
import { commentsQueryRepository } from "../comments-query-repository"
import { commentsRepository } from "../comments-repository"
import { commentEntityMapper } from "./comments-query-service"

export type commentsServicesResponse = {
    result: boolean,
    status: number,
    data: {},
    errors: { errorsMessages: {}[] }
}
export const commentsService = {

    addCommentToPost: async function (postId: string, comment: any, commentatorInfo: any) {
        const response: commentsServicesResponse = {
            result: false,
            status: 404,
            data: {},
            errors: { errorsMessages: ["Not found"] }
        }

        const foundPost = await postsQueryService.findPostById(postId);

        if (!foundPost) {
            return response
        }

        const newCooment: CommentViewModel = {
            id: "",
            content: comment.content,
            commentatorInfo: {
                userId: commentatorInfo.userId,
                userLogin: commentatorInfo.userLogin,
            },
            createdAt: new Date().toISOString()
        }

        const createdCommentId = await commentsRepository.createComment(postId, newCooment)

        if (createdCommentId === "") {
            return { ...response, status: 400 }
        }

        const foundCreatedComment = await commentsQueryRepository.getCommentByID({ id: createdCommentId });

        if (foundCreatedComment) {
            response.result = true
            response.status = 201
            response.data = commentEntityMapper(foundCreatedComment)
        }

        return response

    },

    updateComment: async function (id: string, commentBody: CommentInputModel, user: any) {
        const response: commentsServicesResponse = {
            result: false,
            status: 404,
            data: {},
            errors: { errorsMessages: [] }
        }

        const filter = {
            commentatorInfo: { userId: user.userId, userLogin: user.userLogin }
        }

        const foundcomment = await commentsQueryRepository.getCommentByID(filter)

        if (!foundcomment) {
            response.result = true
            response.status = 403
            response.data = {}
            return response
        }

        const isCommentUpdated = await commentsRepository.updateComment(id, commentBody);

        if (isCommentUpdated) {
            response.result = true
            response.status = 204
        }

        return response
    },

    deleteComment: async function (id: string, user: any) {
        const response: commentsServicesResponse = {
            result: false,
            status: 404,
            data: {},
            errors: { errorsMessages: [] }
        }

        const filter = {
            commentatorInfo: { userId: user.userId, userLogin: user.userLogin }
        }

        const foundcomment = await commentsQueryRepository.getCommentByID(filter)

        if (!foundcomment) {
            response.result = true
            response.status = 403
            response.data = {}
            return response
        }

        const isBlogDeleted = await commentsRepository.deleteComment(id)
        if (isBlogDeleted) {
            response.result = true
            response.status = 204
        }

        return response
    },



}
import { CommentInputModel, CommentViewModel } from "../../../input-output-types/comments-models"
import { ServicesResponseNew, HTTP_STATUS_CODE, PaginationResponseType } from "../../../input-output-types/types"
import { postsQueryService } from "../../posts/services/posts-query-service"
import { commentsQueryRepository } from "../comments-query-repository"
import { commentsRepository } from "../comments-repository"
import { commentEntityMapper } from "./comments-query-service"


export const commentsService = {

    addCommentToPost: async function (postId: string, content: any, commentatorInfo: any) {
        const response: ServicesResponseNew<CommentViewModel | {}> = {
            result: false,
            status: HTTP_STATUS_CODE.NotFound,
            data: {},
            errors: { errorsMessages: [] }
        }

        const foundPost = await postsQueryService.findPostById(postId);

        if (!foundPost.result) {
            return response
        }

        const newCooment: CommentViewModel = {
            id: "",
            content: content,
            commentatorInfo: {
                userId: commentatorInfo.userId,
                userLogin: commentatorInfo.userLogin,
            },
            createdAt: new Date().toISOString()
        }

        const createdCommentId = await commentsRepository.createComment(postId, newCooment)

        if (createdCommentId === "") {
            return { ...response, status: HTTP_STATUS_CODE.BadRequest }
        }

        const foundCreatedComment = await commentsQueryRepository.getCommentByID(createdCommentId)

        if (foundCreatedComment) {
            response.result = true
            response.status = HTTP_STATUS_CODE.Created
            response.data = commentEntityMapper(foundCreatedComment)
        }

        return response

    },

    updateComment: async function (id: string, commentBody: CommentInputModel, currUser: any) {

        const response: ServicesResponseNew<CommentViewModel | {}> = {
            result: false,
            status: HTTP_STATUS_CODE.NotFound,
            data: {},
            errors: { errorsMessages: [] }
        }

        const filter = {
            commentatorInfo: { userId: currUser.userId, userLogin: currUser.userLogin }
        }

        const foundcomment = await commentsQueryRepository.getCommentByFilter(filter)

        if (!foundcomment) {
            response.status = HTTP_STATUS_CODE.Forbidden
            return response
        }

        const operationAction = {
            $set: {
                content: commentBody.content,
            }
        }

        const istUpdated = await commentsRepository.updateComment(id, operationAction);

        if (istUpdated) {
            response.result = true
            response.status = HTTP_STATUS_CODE.NoContent
        }

        return response
    },

    deleteComment: async function (id: string, user: any) {

        const response: ServicesResponseNew<CommentViewModel | {}> = {
            result: false,
            status: HTTP_STATUS_CODE.NotFound,
            data: {},
            errors: { errorsMessages: [] }
        }

        const filter = {
            commentatorInfo: { userId: user.userId, userLogin: user.userLogin }
        }

        const foundcomment = await commentsQueryRepository.getCommentByFilter(filter)

        if (!foundcomment) {
            response.status = HTTP_STATUS_CODE.Forbidden
            return response
        }

        const isDeleted = await commentsRepository.deleteComment(id)

        if (isDeleted) {
            response.result = true
            response.status = HTTP_STATUS_CODE.NoContent
        }

        return response
    },



}


// export const isServerError = (error: unknown): error is TServerError =>
//     typeof error === 'object' && error !== null && 'code' in error;


// export type TServerError = {
//     code?: string;
//     message: string;
//     name?: string;
//     details?: { [key: string]: string };
//     fields?: string[];
// };

// export type TResult<T = null> =
//     | { status: Extract<TStatus, 'Success'>; data: T; errorsMessages?: never }
//     | {
//         status: Exclude<TStatus, 'Success'>;
//         data?: never;
//         errorsMessages: TErrorType[];
//     };

// export type TStatus = (typeof ResultStatus)[keyof typeof ResultStatus];

// type TStatus = "Success" | "NotFound" | "Forbidden" | "Unauthorized" | "BadRequest" | "InternalError"
import { injectable } from "inversify"
import { CommentInputModel, CommentViewModel } from "../../../input-output-types/comments-models"
import { ServicesResponseNew, HTTP_STATUS_CODE, PaginationResponseType } from "../../../input-output-types/types"
import { PostsQueryService } from "../../posts/services/posts-query-service"
import { CommentsQueryRepository } from "../repo/comments-query-repository"
import { CommentsRepository } from "../repo/comments-repository"
import { commentEntityMapper } from "./comments-query-service"

@injectable()
export class CommentsService {

    constructor(
        protected commentsRepository: CommentsRepository,
        protected commentsQueryRepository: CommentsQueryRepository,
        protected postsQueryService: PostsQueryService,
    ) { }

    async addCommentToPost(postId: string, content: any, commentatorInfo: any) {
        const response: ServicesResponseNew<CommentViewModel | {}> = {
            result: false,
            status: HTTP_STATUS_CODE.NotFound,
            data: {},
            errors: { errorsMessages: [] }
        }

        const foundPost = await this.postsQueryService.findPostById(postId);

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

        const createdCommentId = await this.commentsRepository.createComment(postId, newCooment)

        if (createdCommentId === "") {
            return { ...response, status: HTTP_STATUS_CODE.BadRequest }
        }

        const foundCreatedComment = await this.commentsQueryRepository.getCommentByID(createdCommentId)

        if (foundCreatedComment) {
            response.result = true
            response.status = HTTP_STATUS_CODE.Created
            response.data = commentEntityMapper(foundCreatedComment)
        }

        return response

    }

    async updateComment(id: string, commentBody: CommentInputModel, currUser: any) {

        const response: ServicesResponseNew<CommentViewModel | {}> = {
            result: false,
            status: HTTP_STATUS_CODE.NotFound,
            data: {},
            errors: { errorsMessages: [] }
        }

        const filter = {
            commentatorInfo: { userId: currUser.userId, userLogin: currUser.userLogin }
        }

        const foundcomment = await this.commentsQueryRepository.getCommentByFilter(filter)

        if (!foundcomment) {
            response.status = HTTP_STATUS_CODE.Forbidden
            return response
        }

        const operationAction = {
            $set: {
                content: commentBody.content,
            }
        }

        const istUpdated = await this.commentsRepository.updateComment(id, operationAction);

        if (istUpdated) {
            response.result = true
            response.status = HTTP_STATUS_CODE.NoContent
        }

        return response
    }

    async deleteComment(id: string, user: any) {

        const response: ServicesResponseNew<CommentViewModel | {}> = {
            result: false,
            status: HTTP_STATUS_CODE.NotFound,
            data: {},
            errors: { errorsMessages: [] }
        }

        const filter = {
            commentatorInfo: { userId: user.userId, userLogin: user.userLogin }
        }

        const foundcomment = await this.commentsQueryRepository.getCommentByFilter(filter)

        if (!foundcomment) {
            response.status = HTTP_STATUS_CODE.Forbidden
            return response
        }

        const isDeleted = await this.commentsRepository.deleteComment(id)

        if (isDeleted) {
            response.result = true
            response.status = HTTP_STATUS_CODE.NoContent
        }

        return response
    }

}
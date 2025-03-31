import { injectable } from "inversify"
import { CommentInputModel, CommentModel, CommentViewModel } from "../../../input-output-types/comments-models"
import { ServicesResponseNew, HTTP_STATUS_CODE } from "../../../input-output-types/types"
import { PostsQueryService } from "../../posts/services/posts-query-service"
import { CommentsQueryRepository } from "../repo/comments-query-repository"
import { CommentsRepository } from "../repo/comments-repository"
import { LikesService } from "../../likes/services/likes-service"

@injectable()
export class CommentsService {

    constructor(
        protected commentsRepository: CommentsRepository,
        protected commentsQueryRepository: CommentsQueryRepository,
        protected postsQueryService: PostsQueryService,
        protected likesService: LikesService
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

        const newCooment = await CommentModel.create({
            content: content,
            commentatorInfo: {
                userId: commentatorInfo.userId,
                userLogin: commentatorInfo.userLogin,
            },
            createdAt: new Date().toISOString(),
            postId: postId
        })

        await newCooment.save()
        const likeInfo = await this.likesService.getLikesInfo(commentatorInfo.userId, postId)
        newCooment.likesInfo = likeInfo

        if (newCooment) {
            response.result = true
            response.status = HTTP_STATUS_CODE.Created
            response.data = newCooment
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

        const content = commentBody.content

        const istUpdated = await this.commentsRepository.updateComment(id, content);

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
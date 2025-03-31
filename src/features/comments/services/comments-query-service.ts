import { injectable } from "inversify"
import { CommentModel, CommentViewModel } from "../../../input-output-types/comments-models"
import { ServicesResponseNew, HTTP_STATUS_CODE, PaginationResponseType } from "../../../input-output-types/types"
import { CommentsQueryRepository } from "../repo/comments-query-repository";
import { LikesService } from "../../likes/services/likes-service";

@injectable()
export class CommentsQueryService {
    constructor(
        protected commentsQueryRepository: CommentsQueryRepository,
        protected likeService: LikesService,
    ) { }

    async findCommentById(id: string) {
        const result: ServicesResponseNew<CommentViewModel | {}> = {
            result: false,
            status: HTTP_STATUS_CODE.NotFound,
            data: {},
            errors: { errorsMessages: [] }
        }

        const foundComment = await this.commentsQueryRepository.getCommentByID(id)

        if (!foundComment) {
            return result
        };

        result.result = true
        result.status = HTTP_STATUS_CODE.OK
        result.data = foundComment.toJSON()
        result.errors = { errorsMessages: [] }

        return result
    }

    async findCommentsOfPost(postId: string, queryParams: any, loginedUserId: string) {
        const pageNumber = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy = queryParams.sortBy ? queryParams.sortBy : "createdAt"
        const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc'
        const searchNameTerm = queryParams.searchNameTerm ? queryParams.searchNameTerm : ""

        const foundComments = await this.commentsQueryRepository.getCommentsOfPost(
            postId,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm)

        for (const el of foundComments) {
            el.likesInfo = await this.likeService.getLikesInfo(loginedUserId, el.id)
        }

        const _totalCount = await this.commentsQueryRepository.getDocumetnsCountOfPost({ postId: postId })

        const result: ServicesResponseNew<PaginationResponseType<CommentViewModel>> = {
            result: true,
            status: HTTP_STATUS_CODE.OK,
            data: {
                pagesCount: Math.ceil(_totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: _totalCount,
                items: foundComments,
            },
            errors: { errorsMessages: [] }
        }

        return result
    }
}
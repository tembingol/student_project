import { CommentDataBaseModel, CommentViewModel } from "../../../input-output-types/comments-models"
import { ServicesResponseNew, HTTP_STATUS_CODE, PaginationResponseType } from "../../../input-output-types/types"
import { injectable } from "inversify"
import { CommentsQueryRepository } from "../repo/comments-query-repository";

@injectable()
export class CommentsQueryService {

    constructor(
        protected commentsQueryRepository: CommentsQueryRepository
    ) { }

    async findCommentById(id: string) {
        const result: ServicesResponseNew<CommentViewModel | {}> = {
            result: false,
            status: HTTP_STATUS_CODE.NotFound,
            data: {},
            errors: { errorsMessages: [] }
        }
        const foundComment = await this.commentsQueryRepository.getCommentByID(id);

        if (foundComment) {
            result.result = true
            result.status = HTTP_STATUS_CODE.OK
            result.data = commentEntityMapper(foundComment)
            result.errors = { errorsMessages: [] }
        }

        return result
    }

    async findCommentsOfPost(postId: string, queryParams: any) {
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

export function commentEntityMapper(comment: CommentDataBaseModel,): CommentViewModel {
    return {
        id: comment._id!.toString(),
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt,
    }
}
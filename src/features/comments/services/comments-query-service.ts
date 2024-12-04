import { CommentDataBaseModel, CommentViewModel } from "../../../input-output-types/comments-models"
import { ServicesResponse } from "../../../input-output-types/services-models"
import { commentsQueryRepository } from "../comments-query-repository"


export const commentsQueryService = {

    findCommentById: async function (id: string) {
        const result: ServicesResponse = {
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

    findCommentsOfPost: async function (postId: string, queryParams: any) {
        const pageNumber = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy = queryParams.sortBy ? queryParams.sortBy : "createdAt"
        const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc'
        const searchNameTerm = queryParams.searchNameTerm ? queryParams.searchNameTerm : ""

        const foundComments = await commentsQueryRepository.getCommentsOfPost(
            postId,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm)

        // const filter: any = {}
        // filter.PostId = PostId
        // if (searchNameTerm) {
        //     filter.title = { $regex: searchNameTerm, $options: 'i' }
        // }

        const _totalCount = await commentsQueryRepository.getDocumetnsCountOfPost({ postId: postId })

        const result: ServicesResponse = {
            result: true,
            status: 200,
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
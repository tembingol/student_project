import { PostDataBaseModel, PostViewModel } from "../../../input-output-types/posts-models"
import { ServicesResponse } from "../../../input-output-types/services-models"
import { HTTP_STATUS_CODE } from "../../../input-output-types/types"
import { postsQueryRepository } from "../posts-query-repository"
import { db } from "../../../db/db"

export const postsQueryService = {

    findPosts: async function (queryParams: any) {
        const pageNumber = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy = queryParams.sortBy ? queryParams.sortBy : "createdAt"
        const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc'
        const searchNameTerm = queryParams.searchNameTerm ? queryParams.searchNameTerm : ""

        const filter: any = {}
        if (searchNameTerm) {
            filter[sortBy] = { $regex: searchNameTerm, $options: 'i' }
        }

        const allPosts = await postsQueryRepository.getAllPosts(
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            filter
        )

        const mappedPosts = allPosts.map((el) => postEntityMapper(el))

        const totalCount = await postsQueryService.getDocumetnsCount(searchNameTerm)

        const result: ServicesResponse = {
            result: true,
            status: HTTP_STATUS_CODE.OK,
            data: {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: mappedPosts,
            },
            errors: { errorsMessages: [] }
        }

        return result
    },

    getDocumetnsCount: async function (searchNameTerm: string) {
        const filter: any = {}
        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' }
        }

        return await postsQueryRepository.getDocumetnsCount(filter)
    },

    getDocumetnsCountBlog: async function (blogId: string, searchNameTerm: string) {
        const filter: any = {}
        filter.blogId = blogId
        if (searchNameTerm) {
            filter.title = { $regex: searchNameTerm, $options: 'i' }
        }

        return await postsQueryRepository.getDocumetnsCount(filter)
    },

    findPostById: async function (id: string) {
        const result: ServicesResponse = {
            result: false,
            status: HTTP_STATUS_CODE.NotFound,
            data: {},
            errors: { errorsMessages: [] }
        }

        const filter = { id: id }

        const foundPost = await postsQueryRepository.getPostByID(filter)

        if (foundPost !== null) {
            result.result = true
            result.status = HTTP_STATUS_CODE.OK
            result.data = postEntityMapper(foundPost)
        }

        return result
    },


    findPostsOfBlog: async function (blogId: string, pageNumber: Number, pageSize: Number, sortBy: string, sortDirection: string, searchNameTerm: string,) {
        const _pageNumber = +pageNumber
        const _pageSize = +pageSize
        const _sortDirection = sortDirection === 'asc' ? 1 : -1

        const allPosts = await db.getCollections().postCollection.find({ "blogId": blogId })
            .skip((_pageNumber - 1) * _pageSize)
            .limit(_pageSize)
            .sort({ createdAt: _sortDirection, [sortBy]: _sortDirection })
            .toArray()

        const mappedPosts = allPosts.map((el) => postEntityMapper(el))

        return mappedPosts
    },

}

export function postEntityMapper(post: PostDataBaseModel): PostViewModel {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
    }
}
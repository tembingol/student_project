import { BlogDataBaseModel, BlogViewModel } from "../../../input-output-types/blogs-models"
import { ServicesResponse } from "../../../input-output-types/services-models"
import { postsQueryService } from "../../posts/services/posts-query-service"
import { blogsQueryRepository } from "../blogs-query-repository"

export const blogsQueryService = {

    findBlogs: async function (queryParams: any) {
        const pageNumber = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy = queryParams.sortBy ? queryParams.sortBy : "createdAt"
        const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc'
        const searchNameTerm = queryParams.searchNameTerm ? queryParams.searchNameTerm : ""

        const filter: any = {}
        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' }
        }

        const allBlogs = await blogsQueryRepository.getAllBlogs(
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            filter,
        )

        const mappedAllBlogs = allBlogs.map((el) => blogEntityMapper(el))

        const totalCount = await blogsQueryRepository.getDocumetnsCount(filter)

        const result: ServicesResponse = {
            result: true,
            status: 200,
            data: {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: mappedAllBlogs,
            },
            errors: { errorsMessages: [] }
        }

        return result
    },

    findBlogById: async function (id: string) {
        const result: ServicesResponse = {
            result: false,
            status: 404,
            data: {},
            errors: { errorsMessages: ["Not found"] }
        }

        const filter = { id: id }
        const foundBlog = await blogsQueryRepository.getBlogByID(filter);

        if (foundBlog) {
            result.result = true
            result.status = 200
            result.data = blogEntityMapper(foundBlog)
            result.errors = { errorsMessages: [] }
        }

        return result
    },

    getDocumetnsCount: async function (searchNameTerm: string) {
        const filter: any = {}
        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' }
        }
        const result = await blogsQueryRepository.getDocumetnsCount(filter)

        return result
    },

    findPostsOfBlog: async function (blogId: string, queryParams: any) {
        const pageNumber = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy = queryParams.sortBy ? queryParams.sortBy : "createdAt"
        const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc'
        const searchNameTerm = queryParams.searchNameTerm ? queryParams.searchNameTerm : ""

        const foundPosts = await postsQueryService.findPostsOfBlog(
            blogId,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm)

        const _totalCount = await postsQueryService.getDocumetnsCountBlog(blogId, searchNameTerm)

        const result: ServicesResponse = {
            result: true,
            status: 200,
            data: {
                pagesCount: Math.ceil(_totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: _totalCount,
                items: foundPosts,
            },
            errors: { errorsMessages: [] }
        }

        return result
    },

}

export function blogEntityMapper(blog: BlogDataBaseModel): BlogViewModel {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
    }
}

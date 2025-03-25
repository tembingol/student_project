import { inject, injectable } from "inversify"
import { BlogViewModel } from "../../../input-output-types/blogs-models"
import { ServicesResponse } from "../../../input-output-types/services-models"
import { HTTP_STATUS_CODE } from "../../../input-output-types/types"
import { PostsQueryService } from "../../posts/services/posts-query-service"
import { BlogsQueryRepository } from "../repo/blogs-query-repository"

@injectable()
export class BlogsQueryService {

    constructor(
        private blogsQueryRepository: BlogsQueryRepository,
        private postsQueryService: PostsQueryService
    ) { }
    async findBlogs(queryParams: any) {
        const pageNumber = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy = queryParams.sortBy ? queryParams.sortBy : "createdAt"
        const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc'
        const searchNameTerm = queryParams.searchNameTerm ? queryParams.searchNameTerm : ""

        const filter: any = {}
        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' }
        }

        const allBlogs = await this.blogsQueryRepository.getAllBlogs(
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            filter,
        )

        const mappedAllBlogs = allBlogs.map((el) => blogEntityMapper(el))

        const totalCount = await this.blogsQueryRepository.getDocumetnsCount(filter)

        const result: ServicesResponse = {
            result: true,
            status: HTTP_STATUS_CODE.OK,
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
    }

    async findBlogById(id: string) {
        const result: ServicesResponse = {
            result: false,
            status: HTTP_STATUS_CODE.NotFound,
            data: {},
            errors: { errorsMessages: ["Not found"] }
        }

        const foundBlog = await this.blogsQueryRepository.getBlogByID(id);

        if (foundBlog) {
            result.result = true
            result.status = HTTP_STATUS_CODE.OK
            result.data = blogEntityMapper(foundBlog)
            result.errors = { errorsMessages: [] }
        }

        return result
    }

    async getDocumetnsCount(searchNameTerm: string) {
        const filter: any = {}
        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' }
        }
        const result = await this.blogsQueryRepository.getDocumetnsCount(filter)

        return result
    }

    async findPostsOfBlog(blogId: string, queryParams: any) {
        const pageNumber = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy = queryParams.sortBy ? queryParams.sortBy : "createdAt"
        const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc'
        const searchNameTerm = queryParams.searchNameTerm ? queryParams.searchNameTerm : ""

        const foundPosts = await this.postsQueryService.findPostsOfBlog(
            blogId,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm)

        const _totalCount = await this.postsQueryService.getDocumetnsCountBlog(blogId, searchNameTerm)

        const result: ServicesResponse = {
            result: true,
            status: HTTP_STATUS_CODE.OK,
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
    }

}

export function blogEntityMapper(blog: any): BlogViewModel {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
    }
}

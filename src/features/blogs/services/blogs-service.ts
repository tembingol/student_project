import { inject, injectable } from "inversify"
import { BlogInputModel } from "../../../input-output-types/blogs-models"
import { PostInputModel } from "../../../input-output-types/posts-models"
import { ServicesResponse } from "../../../input-output-types/services-models"
import { HTTP_STATUS_CODE } from "../../../input-output-types/types"
import { PostsService } from "../../posts/services/posts-service"
import { BlogsRepository } from "../repo/blogs-repository"
import { blogEntityMapper } from "./blogs-query-service"

@injectable()
export class BlogsService {
    constructor(
        private blogsRepository: BlogsRepository,
        private postsService: PostsService
    ) { }

    async createBlog(blogBody: BlogInputModel) {
        const response: ServicesResponse = {
            result: false,
            status: HTTP_STATUS_CODE.BadRequest,
            data: {},
            errors: { errorsMessages: [] }
        }

        const newBblogId = await this.blogsRepository.createBlog(blogBody);

        if (!newBblogId) {
            return response
        }

        // const foundCreatedBlog = await blogsQueryRepository.getBlogByID(newBblogId.id);

        // if (!foundCreatedBlog) {
        //     return response
        // }

        if (newBblogId) {
            response.result = true
            response.status = HTTP_STATUS_CODE.Created
            response.data = blogEntityMapper(newBblogId)
        }

        return response
    }

    async createBlogPost(id: string, postBody: PostInputModel) {
        postBody.blogId = id
        const newPost = await this.postsService.createPost(postBody)

        return newPost
    }

    async updateBlog(id: string, blogBody: BlogInputModel) {
        const response: ServicesResponse = {
            result: false,
            status: HTTP_STATUS_CODE.NotFound,
            data: {},
            errors: { errorsMessages: [] }
        }

        const isBlogUpdated = await this.blogsRepository.updateBlog(id, blogBody);

        if (isBlogUpdated) {
            response.result = true
            response.status = HTTP_STATUS_CODE.NoContent
        }

        return response
    }

    async deleteBlog(id: string) {
        const response: ServicesResponse = {
            result: false,
            status: HTTP_STATUS_CODE.NotFound,
            data: {},
            errors: { errorsMessages: [] }
        }

        const isBlogDeleted = await this.blogsRepository.deleteBlog(id)
        if (isBlogDeleted) {
            response.result = true
            response.status = HTTP_STATUS_CODE.NoContent
        }

        return response
    }
}
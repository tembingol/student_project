import { BlogInputModel } from "../../../input-output-types/blogs-models"
import { PostInputModel } from "../../../input-output-types/posts-models"
import { ServicesResponse } from "../../../input-output-types/services-models"
import { HTTP_STATUS_CODE } from "../../../input-output-types/types"
import { postsService } from "../../posts/services/posts-service"
import { blogsRepository } from "../blogs-repository"
import { blogEntityMapper } from "./blogs-query-service"


export const blogsService = {

    createBlog: async function (blogBody: BlogInputModel) {
        const response: ServicesResponse = {
            result: false,
            status: HTTP_STATUS_CODE.BadRequest,
            data: {},
            errors: { errorsMessages: [] }
        }

        const newBblogId = await blogsRepository.createBlog(blogBody);

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
    },

    createBlogPost: async function (id: string, postBody: PostInputModel) {
        postBody.blogId = id
        const newPost = await postsService.createPost(postBody)

        return newPost
    },

    updateBlog: async function (id: string, blogBody: BlogInputModel) {
        const response: ServicesResponse = {
            result: false,
            status: HTTP_STATUS_CODE.NotFound,
            data: {},
            errors: { errorsMessages: [] }
        }

        const isBlogUpdated = await blogsRepository.updateBlog(id, blogBody);

        if (isBlogUpdated) {
            response.result = true
            response.status = HTTP_STATUS_CODE.NoContent
        }

        return response
    },

    deleteBlog: async function (id: string) {
        const response: ServicesResponse = {
            result: false,
            status: HTTP_STATUS_CODE.NotFound,
            data: {},
            errors: { errorsMessages: [] }
        }

        const isBlogDeleted = await blogsRepository.deleteBlog(id)
        if (isBlogDeleted) {
            response.result = true
            response.status = HTTP_STATUS_CODE.NoContent
        }

        return response
    },

}
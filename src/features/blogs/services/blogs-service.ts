import { BlogInputModel, BlogViewModel } from "../../../input-output-types/blogs-models"
import { PostInputModel } from "../../../input-output-types/posts-models"
import { ServicesResponse } from "../../../input-output-types/services-models"
import { postsService } from "../../posts/services/posts-service"
import { blogsQueryRepository } from "../blogs-query-repository"
import { blogsRepository } from "../blogs-repository"
import { blogEntityMapper } from "./blogs-query-service"


export const blogsService = {

    createBlog: async function (blogBody: BlogInputModel) {
        const response: ServicesResponse = {
            result: false,
            status: 400,
            data: {},
            errors: { errorsMessages: [] }
        }

        const newBlog: BlogViewModel = {
            id: "",
            name: blogBody.name,
            description: blogBody.description,
            websiteUrl: blogBody.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        }

        const newBblogId = await blogsRepository.createBlog(newBlog);
        if (newBblogId === "") {
            return response
        }

        const foundCreatedBlog = await blogsQueryRepository.getBlogByID({ id: newBblogId });

        if (foundCreatedBlog) {
            response.result = true
            response.status = 201
            response.data = blogEntityMapper(foundCreatedBlog)
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
            status: 404,
            data: {},
            errors: { errorsMessages: [] }
        }

        const isBlogUpdated = await blogsRepository.updateBlog(id, blogBody);

        if (isBlogUpdated) {
            response.result = true
            response.status = 204
        }

        return response
    },

    deleteBlog: async function (id: string) {
        const response: ServicesResponse = {
            result: false,
            status: 404,
            data: {},
            errors: { errorsMessages: [] }
        }

        const isBlogDeleted = await blogsRepository.deleteBlog(id)
        if (isBlogDeleted) {
            response.result = true
            response.status = 204
        }

        return response
    },

}
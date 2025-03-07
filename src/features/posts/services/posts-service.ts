import { PostInputModel, PostViewModel } from "../../../input-output-types/posts-models"
import { ServicesResponse } from "../../../input-output-types/services-models"
import { HTTP_STATUS_CODE } from "../../../input-output-types/types"
import { postsQueryRepository } from "../posts-query-repository"
import { postsRepository } from "../posts-repository"
import { postEntityMapper } from "./posts-query-service"



export const postsService = {

    createPost: async function (postBody: PostInputModel) {
        const response: ServicesResponse = {
            result: false,
            status: HTTP_STATUS_CODE.BadRequest,
            data: {},
            errors: { errorsMessages: [] }
        }

        const newPost: PostViewModel = {
            id: "",
            title: postBody.title,
            shortDescription: postBody.shortDescription,
            content: postBody.content,
            blogId: postBody.blogId,
            blogName: postBody.blogName ? postBody.blogName : "",
            createdAt: new Date().toISOString(),
        }

        const newPostId = await postsRepository.createPost(newPost);
        if (newPostId === "") {
            return response
        }

        let foundCreatedPost = await postsQueryRepository.getPostByID({ id: newPostId });

        if (foundCreatedPost) {
            response.result = true
            response.status = HTTP_STATUS_CODE.Created
            response.data = postEntityMapper(foundCreatedPost)
        }

        return response
    },

    updatePost: async function (id: string, postBody: PostInputModel) {
        const response: ServicesResponse = {
            result: false,
            status: 404,
            data: {},
            errors: { errorsMessages: [] }
        }

        const isPostUpdated = await postsRepository.updatePost(id, postBody);

        if (isPostUpdated) {
            response.result = true
            response.status = 204
        }

        return response
    },

    deletePost: async function (id: string) {
        const response: ServicesResponse = {
            result: false,
            status: 404,
            data: {},
            errors: { errorsMessages: [] }
        }

        const isPostDeleted = await postsRepository.deletePost(id)
        if (isPostDeleted) {
            response.result = true
            response.status = 204
        }

        return response
    },

}
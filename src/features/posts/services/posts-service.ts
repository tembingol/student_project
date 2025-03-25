import { inject, injectable } from "inversify"
import { PostInputModel, PostViewModel } from "../../../input-output-types/posts-models"
import { ServicesResponse } from "../../../input-output-types/services-models"
import { HTTP_STATUS_CODE } from "../../../input-output-types/types"
import { PostsQueryRepository } from "../repo/posts-query-repository"
import { PostsRepository } from "../repo/posts-repository"
import { postEntityMapper } from "./posts-query-service"

@injectable()
export class PostsService {

    constructor(
        private postsRepository: PostsRepository,
        private postsQueryRepository: PostsQueryRepository
    ) { }

    async createPost(postBody: PostInputModel) {
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

        const newPostId = await this.postsRepository.createPost(newPost);
        if (newPostId === "") {
            return response
        }

        let foundCreatedPost = await this.postsQueryRepository.getPostByID({ id: newPostId });

        if (foundCreatedPost) {
            response.result = true
            response.status = HTTP_STATUS_CODE.Created
            response.data = postEntityMapper(foundCreatedPost)
        }

        return response
    }

    async updatePost(id: string, postBody: PostInputModel) {
        const response: ServicesResponse = {
            result: false,
            status: HTTP_STATUS_CODE.NotFound,
            data: {},
            errors: { errorsMessages: [] }
        }

        const isPostUpdated = await this.postsRepository.updatePost(id, postBody);

        if (isPostUpdated) {
            response.result = true
            response.status = HTTP_STATUS_CODE.NoContent
        }

        return response
    }

    async deletePost(id: string) {
        const response: ServicesResponse = {
            result: false,
            status: HTTP_STATUS_CODE.NotFound,
            data: {},
            errors: { errorsMessages: [] }
        }

        const isPostDeleted = await this.postsRepository.deletePost(id)
        if (isPostDeleted) {
            response.result = true
            response.status = HTTP_STATUS_CODE.NoContent
        }

        return response
    }

}
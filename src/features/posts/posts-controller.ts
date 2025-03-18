import { Request, Response } from "express"
import { injectable } from "inversify"
import { PostsService } from "./services/posts-service"
import { PostsQueryService } from "./services/posts-query-service"
import { CommentsQueryService } from "../comments/services/comments-query-service"
import { CommentsService } from "../comments/services/comments-service"

@injectable()
export class PostsController {
    constructor(
        protected postsService: PostsService,
        protected postsQueryService: PostsQueryService,
        protected commentsQueryService: CommentsQueryService,
        protected commentsService: CommentsService
    ) { }


    async getAllPosts(req: Request, res: Response) {
        const serviceRes = await this.postsQueryService.findPosts(req.query)
        res.status(serviceRes.status).json(serviceRes.data)
    }

    async getPostById(req: Request, res: Response) {
        const serviceRes = await this.postsQueryService.findPostById(req.params.id)
        if (!serviceRes.result) {
            res.sendStatus(serviceRes.status)
            return
        }

        res.status(serviceRes.status).json(serviceRes.data)
    }

    async getCommentsOfPost(req: Request, res: Response) {

        const foundPost = await this.postsQueryService.findPostById(req.params.id);
        if (!foundPost.result) {
            res.sendStatus(foundPost.status)
            return
        }

        const foundCommentsOfPost = await this.commentsQueryService.findCommentsOfPost(req.params.id, req.query);
        res.status(foundCommentsOfPost.status).json(foundCommentsOfPost.data)
    }

    async addCommentToPost(req: Request, res: Response) {

        const content = req.body.content

        const foundPost = await this.postsQueryService.findPostById(req.params.id);
        if (!foundPost.result) {
            res.sendStatus(foundPost.status)
            return
        }

        const loginedUser = req.context!.currentUser

        const newCommentResult = await this.commentsService.addCommentToPost(req.params.id, content, loginedUser);

        if (!newCommentResult.result) {
            res.sendStatus(newCommentResult.status)
            return
        }
        res.status(newCommentResult.status).json(newCommentResult.data)
    }


    async createPost(req: Request, res: Response) {
        const serviceRes = await this.postsService.createPost(req.body);
        res.status(serviceRes.status).json(serviceRes.data)
    }

    async updatePost(req: Request, res: Response) {
        const serviceRes = await this.postsService.updatePost(req.params.id, req.body);
        if (!serviceRes.result) {
            res.sendStatus(serviceRes.status)
            return
        }

        res.status(serviceRes.status).json(serviceRes.data)
    }

    async deletePost(req: Request, res: Response) {
        const serviceRes = await this.postsService.deletePost(req.params.id)
        if (!serviceRes.result) {
            res.sendStatus(serviceRes.status)
            return
        }

        res.status(serviceRes.status).json(serviceRes.data)
    }

}
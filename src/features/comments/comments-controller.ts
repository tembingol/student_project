import { Request, Response } from "express"
import { inject, injectable } from "inversify"
import { CommentsService } from "./services/comments-service"
import { CommentsQueryService } from "./services/comments-query-service"
import { LikesService } from "../likes/services/likes-service"

@injectable()
export class CommentsController {

    constructor(
        private commentsService: CommentsService,
        private commentsQueryService: CommentsQueryService,
        private likeService: LikesService
    ) { }

    async findCommentById(req: Request, res: Response) {

        const loginedUser = req.context!.currentUser

        const serviceRes = await this.commentsQueryService.findCommentById(req.params.id)
        const likesInfo = await this.likeService.getLikesInfo(loginedUser.userId, req.params.id)

        if (!serviceRes.result) {
            res.sendStatus(serviceRes.status)
            return
        }
        const result = { ...serviceRes.data }
        result.likesInfo = likesInfo

        res.status(serviceRes.status).json(result)
    }

    async updateComment(req: Request, res: Response) {

        const loginedUser = req.context!.currentUser

        const serviceRes = await this.commentsService.updateComment(req.params.id, req.body, loginedUser)
        if (!serviceRes.result) {
            res.sendStatus(serviceRes.status)
            return
        }

        res.status(serviceRes.status).json(serviceRes.data)
    }

    async deleteComment(req: Request, res: Response) {

        const loginedUser = req.context!.currentUser

        const serviceRes = await this.commentsService.deleteComment(req.params.id, loginedUser)
        if (!serviceRes.result) {
            res.sendStatus(serviceRes.status)
            return
        }

        res.status(serviceRes.status).json(serviceRes.data)
    }

    async updateLikeStatus(req: Request, res: Response) {

        const loginedUser = req.context!.currentUser

        const foundComment = await this.commentsQueryService.findCommentById(req.params.id)
        if (!foundComment.result) {
            res.sendStatus(foundComment.status)
            return
        }

        const serviceRes = await this.likeService.updateLikeStatus(req.params.id, req.body, loginedUser.userId)
        if (!serviceRes.result) {
            res.status(serviceRes.status).json(serviceRes.errors)
            return
        }

        res.status(serviceRes.status).json(serviceRes.data)

    }
}

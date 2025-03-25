import { Request, Response } from "express"
import { inject, injectable } from "inversify"
import { CommentsService } from "./services/comments-service"
import { CommentsQueryService } from "./services/comments-query-service"

@injectable()
export class CommentsController {

    constructor(
        private commentsService: CommentsService,
        private commentsQueryService: CommentsQueryService
    ) { }

    async findCommentById(req: Request, res: Response) {
        const serviceRes = await this.commentsQueryService.findCommentById(req.params.id)
        if (!serviceRes.result) {
            res.sendStatus(serviceRes.status)
            return
        }

        res.status(serviceRes.status).json(serviceRes.data)
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
}

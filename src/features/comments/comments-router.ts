import { Router } from "express"
import { commentsQueryService } from "./services/comments-query-service"
import { commentsService } from "./services/comments-service"
import { commentValidators } from "./middlewares/comments-validators"
import { authMiddleware } from "../../global-middlewares/jwt-auth-middleware"

export const commentsRouter = Router({})

commentsRouter.get('/:id', async (req, res) => {
    const serviceRes = await commentsQueryService.findCommentById(req.params.id)
    if (!serviceRes.result) {
        res.sendStatus(serviceRes.status)
        return
    }

    res.status(serviceRes.status).json(serviceRes.data)
})

commentsRouter.put('/:id', authMiddleware, ...commentValidators, async (req, res) => {

    const loginedUser = req.context!.currentUser

    const serviceRes = await commentsService.updateComment(req.params.id, req.body, loginedUser)
    if (!serviceRes.result) {
        res.sendStatus(serviceRes.status)
        return
    }

    res.status(serviceRes.status).json(serviceRes.data)
})

commentsRouter.delete('/:id', authMiddleware, async (req, res) => {

    const loginedUser = req.context!.currentUser

    const serviceRes = await commentsService.deleteComment(req.params.id, loginedUser)
    if (!serviceRes.result) {
        res.sendStatus(serviceRes.status)
        return
    }

    res.status(serviceRes.status).json(serviceRes.data)
})

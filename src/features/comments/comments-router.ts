import { Router } from "express"
import { commentsQueryService } from "./services/comments-query-service"
import { commentsService } from "./services/comments-service"
import { commentValidators } from "./middlewares/comments-validators"

export const commentsRouter = Router({})

// // simple logger for this router's requests
// // all requests to this router will first hit this middleware
// blogsRouter.use(function (req, res, next) {
//     console.log('commentsRouter Logger \n{--')
//     console.log('%s ,%s ,%s', req.method, req.body, req.baseUrl + req.url)
//     console.log('--}')
//     next()
// })

commentsRouter.get('/:id', async (req, res) => {
    const serviceRes = await commentsQueryService.findCommentById(req.params.id)
    if (!serviceRes.result) {
        res.sendStatus(serviceRes.status)
        return
    }

    res.status(serviceRes.status).json(serviceRes.data)
})

commentsRouter.put('/:id', ...commentValidators, async (req, res) => {
    const serviceRes = await commentsService.updateComment(req.params.id, req.body)
    if (!serviceRes.result) {
        res.sendStatus(serviceRes.status)
        return
    }

    res.status(serviceRes.status).json(serviceRes.data)
})

commentsRouter.delete('/:id', async (req, res) => {
    const serviceRes = await commentsService.deleteComment(req.params.id)
    if (!serviceRes.result) {
        res.sendStatus(serviceRes.status)
        return
    }

    res.status(serviceRes.status).json(serviceRes.data)
})

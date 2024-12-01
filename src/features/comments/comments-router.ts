import { Router } from "express"
import { commentsQueryService } from "./services/comments-query-service"
import { commentsService } from "./services/comments-service"
import { commentValidators } from "./middlewares/comments-validators"
import { jwtService } from "../../application-services/JWT-service"

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

commentsRouter.put('/:id', async (req, res) => {
    const authorization = req.headers['Authorization'.toLowerCase()]

    if (typeof authorization == "undefined") {
        res.sendStatus(401)
        return
    }

    const userToken = authorization.slice(7)

    let foundUser = await jwtService.getUserIdFromToken(userToken.toString())

    if (foundUser === null) {
        res.sendStatus(401)
        return
    }

    const content = req.body.content
    if (!content) {
        res.status(400).send({ errorsMessages: [{ message: 'more then 300 or less 20', field: 'content' }] })
        return
    }

    if (content.length < 20 || content.length > 300) {
        res.status(400).send({ errorsMessages: [{ message: 'more then 300 or less 20', field: 'content' }] })
        return
    }

    const serviceRes = await commentsService.updateComment(req.params.id, req.body, foundUser)
    if (!serviceRes.result) {
        res.sendStatus(serviceRes.status)
        return
    }

    res.status(serviceRes.status).json(serviceRes.data)
})

commentsRouter.delete('/:id', async (req, res) => {

    const authorization = req.headers['Authorization'.toLowerCase()]

    if (typeof authorization == "undefined") {
        res.sendStatus(401)
        return
    }

    const userToken = authorization.slice(7)

    let foundUser = await jwtService.getUserIdFromToken(userToken.toString())

    if (foundUser === null) {
        res.sendStatus(401)
        return
    }

    const serviceRes = await commentsService.deleteComment(req.params.id, foundUser)
    if (!serviceRes.result) {
        res.sendStatus(serviceRes.status)
        return
    }

    res.status(serviceRes.status).json(serviceRes.data)
})

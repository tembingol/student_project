import { Router } from "express";
import { baseAuthMiddleware } from "../../global-middlewares/base-auth-middleware";
import { postValidators } from "./middlewares/post-validators";
import { postsService } from "./services/posts-service";
import { postsQueryService } from "./services/posts-query-service";

export const postRouter = Router({})

// simple logger for this router's requests
// all requests to this router will first hit this middleware
// postRouter.use(function (req, res, next) {
//     console.log('postRouter Logger \n{--')
//     console.log('%s ,%s ,%s', req.method, req.body, req.baseUrl + req.url)
//     console.log('--}')
//     next()
// })

postRouter.get('/', async (req, res) => {
    const serviceRes = await postsQueryService.findPosts(req.query)
    res.status(serviceRes.status).json(serviceRes.data)
})

postRouter.get('/:id', async (req, res) => {
    const serviceRes = await postsQueryService.findPostById(req.params.id)
    if (!serviceRes.result) {
        res.sendStatus(serviceRes.status)
        return
    }

    res.status(serviceRes.status).json(serviceRes.data)
})

postRouter.post('/', ...postValidators, async (req, res) => {
    const serviceRes = await postsService.createPost(req.body);
    res.status(serviceRes.status).json(serviceRes.data)
})

postRouter.put('/:id', ...postValidators, async (req, res) => {
    const serviceRes = await postsService.updatePost(req.params.id, req.body);
    if (!serviceRes.result) {
        res.sendStatus(serviceRes.status)
        return
    }

    res.status(serviceRes.status).json(serviceRes.data)
})

postRouter.delete('/:id', baseAuthMiddleware, async (req, res) => {
    const serviceRes = await postsService.deletePost(req.params.id)
    if (!serviceRes.result) {
        res.sendStatus(serviceRes.status)
        return
    }

    res.status(serviceRes.status).json(serviceRes.data)
})

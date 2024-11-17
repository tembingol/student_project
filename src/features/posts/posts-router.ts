import { Router } from "express";
import { baseAuthMiddleware } from "../../global-middlewares/base-auth-middleware";
import { postValidators } from "./middlewares/post-validators";
import { postsService } from "./services/post-service";

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
    const foudPosts = await postsService.findPosts(req.query)
    res.status(200).json(foudPosts)
})

postRouter.get('/:id', async (req, res) => {
    const fuondPost = await postsService.findPostById(req.params.id)
    if (!fuondPost) {
        res.sendStatus(404)
        return
    }
    res.status(200).json(fuondPost)
})

postRouter.post('/', ...postValidators, async (req, res) => {
    const newBblog = await postsService.createPost(req.body);
    if (!newBblog) {
        res.sendStatus(400)
        return
    }
    res.status(201).json(newBblog)
})

postRouter.put('/:id', ...postValidators, async (req, res) => {
    const isPostUpdated = await postsService.updatePost(req.params.id, req.body);
    if (!isPostUpdated) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})

postRouter.delete('/:id', baseAuthMiddleware, async (req, res) => {
    const isPostDeleted = await postsService.deletePost(req.params.id)
    if (!isPostDeleted) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})

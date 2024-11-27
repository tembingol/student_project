import { Router } from "express";
import { baseAuthMiddleware } from "../../global-middlewares/base-auth-middleware";
import { postValidators } from "./middlewares/post-validators";
import { postsService } from "./services/posts-service";
import { postsQueryService } from "./services/posts-query-service";
import { commentsQueryService } from "../comments/services/comments-query-service";
import { commentsService } from "../comments/services/comments-service";

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

postRouter.get('/:id/comments', async (req, res) => {

    const foundPost = await postsQueryService.findPostById(req.params.id);
    if (!foundPost.result) {
        res.sendStatus(foundPost.status)
        return
    }

    const foundCommentsOfPost = await commentsQueryService.findCommentsOfPost(req.params.id, req.query);
    res.status(foundCommentsOfPost.status).json(foundCommentsOfPost.data)
})

postRouter.post('/:id/comments', async (req, res) => {

    const foundPost = await postsQueryService.findPostById(req.params.id);
    if (!foundPost.result) {
        res.sendStatus(foundPost.status)
        return
    }

    const commentatorInfo = {
        userId: "userId",
        userLogin: "string",
    }

    const newComment = await commentsService.addCommentToPost(req.params.id, req.body, commentatorInfo);

    if (!newComment.result) {
        res.sendStatus(newComment.status)
        return
    }
    res.status(newComment.status).json(newComment.data)
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

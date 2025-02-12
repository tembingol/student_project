import { Router } from "express";
import { baseAuthMiddleware } from "../../global-middlewares/base-auth-middleware";
import { postValidators } from "./middlewares/post-validators";
import { postsService } from "./services/posts-service";
import { postsQueryService } from "./services/posts-query-service";
import { commentsQueryService } from "../comments/services/comments-query-service";
import { commentsService } from "../comments/services/comments-service";
import { commentValidators } from "../comments/middlewares/comments-validators";
import { authMiddleware } from "../../global-middlewares/jwt-auth-middleware";

export const postRouter = Router({})

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

postRouter.post('/:id/comments', authMiddleware, ...commentValidators, async (req, res) => {

    const content = req.body.content

    const foundPost = await postsQueryService.findPostById(req.params.id);
    if (!foundPost.result) {
        res.sendStatus(foundPost.status)
        return
    }

    const loginedUser = req.context!.currentUser

    const newCommentResult = await commentsService.addCommentToPost(req.params.id, content, loginedUser);

    if (!newCommentResult.result) {
        res.sendStatus(newCommentResult.status)
        return
    }
    res.status(newCommentResult.status).json(newCommentResult.data)
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

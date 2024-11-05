import { Router } from "express";
import { baseAuthMiddleware } from "../../global-middlewares/base-auth-middleware";
import { postsRepository } from "./posts-repository";
import { postValidators } from "./middlewares/post-validators";

export const postRouter = Router({})

postRouter.get('/', async (req, res) => {
    const foudPosts = await postsRepository.getAllPosts()
    res.status(200).json(foudPosts)
})

postRouter.get('/:id', async (req, res) => {
    const fuondPost = await postsRepository.getPostByID(req.params.id)
    if (!fuondPost) {
        res.sendStatus(404)
        return
    }
    res.status(200).json(fuondPost)
})

postRouter.post('/', ...postValidators, async (req, res) => {
    const newPostId = await postsRepository.createPost(req.body)
    if (newPostId.result === false) {
        res.sendStatus(400)
        return
    }
    const foundPost = await postsRepository.getPostByID(newPostId.id);
    res.status(201).json(foundPost)
})

postRouter.put('/:id', ...postValidators, async (req, res) => {
    const isPostUpdated = await postsRepository.updatePost(req.params.id, req.body);
    if (!isPostUpdated) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})

postRouter.delete('/:id', baseAuthMiddleware, async (req, res) => {
    const isPostDeleted = await postsRepository.deletePost(req.params.id)
    if (!isPostDeleted) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})

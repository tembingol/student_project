import { Router } from "express";
import { baseAuthMiddleware } from "../../global-middlewares/base-auth-middleware";
import { postsRepository } from "./posts-repository";
import { postValidators } from "./middlewares/post-validators";

export const postRouter = Router({})

postRouter.get('/', (req, res) => {
    const foudPosts = postsRepository.getAllPosts()
    res.status(200).json(foudPosts)
})

postRouter.get('/:id', (req, res) => {
    const fuondPost = postsRepository.getPostByID(req.params.id)
    if (!fuondPost) {
        res.sendStatus(404)
        return
    }
    res.status(200).json(fuondPost)
})

postRouter.post('/', ...postValidators, (req, res) => {
    const newPostId = postsRepository.createPost(req.body)
    if (!newPostId) {
        res.sendStatus(400)
        return
    }
    const foundPost = postsRepository.getPostByID(newPostId);
    res.status(201).json(foundPost)
})

postRouter.put('/:id', ...postValidators, (req, res) => {
    const isPostUpdated = postsRepository.updatePost(req.params.id, req.body);
    if (!isPostUpdated) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})

postRouter.delete('/:id', baseAuthMiddleware, (req, res) => {
    const isPostDeleted = postsRepository.deletePost(req.params.id)
    if (!isPostDeleted) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})

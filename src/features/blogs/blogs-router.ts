import { Router } from "express";
import { baseAuthMiddleware } from "../../global-middlewares/base-auth-middleware";
import { blogsRepository } from "./blogs-repository";
import { blogValidators } from "./middlewares/blog-validators";

export const blogsRouter = Router({})

blogsRouter.get('/', async (req, res) => {
    const allBlogs = await blogsRepository.getAllBlogs()
    res.status(200).json(allBlogs)
})

blogsRouter.get('/:id', async (req, res) => {
    const foundBlog = await blogsRepository.getBlogByID(req.params.id);
    if (!foundBlog) {
        res.sendStatus(404)
        return
    }
    res.status(200).json(foundBlog)
})

blogsRouter.post('/', ...blogValidators, async (req, res) => {

    const isNewBblogCreated = await blogsRepository.createBlog(req.body);
    if (isNewBblogCreated.result === false) {
        res.sendStatus(400)
        return
    }
    const foundBlog = await blogsRepository.getBlogByID(isNewBblogCreated.id);
    res.status(201).json(foundBlog)
})

blogsRouter.put('/:id', ...blogValidators, async (req, res) => {
    const isBlogUpdated = await blogsRepository.updateBlog(req.params.id, req.body);
    if (!isBlogUpdated) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})

blogsRouter.delete('/:id', baseAuthMiddleware, async (req, res) => {
    const isBlogDeleted = await blogsRepository.deleteBlog(req.params.id)
    if (!isBlogDeleted) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})

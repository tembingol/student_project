import { Router } from "express";
import { baseAuthMiddleware } from "../../global-middlewares/base-auth-middleware";
import { blogsRepository } from "./blogs-repository";
import { blogValidators } from "./middlewares/blog-validators";

export const blogsRouter = Router({})

blogsRouter.get('/', (req, res) => {
    const allBlogs = blogsRepository.getAllBlogs()
    res.status(200).json(allBlogs)
})

blogsRouter.get('/:id', (req, res) => {
    const foundBlog = blogsRepository.getBlogByID(req.params.id);
    if (!foundBlog) {
        res.sendStatus(404)
        return
    }
    res.status(200).json(foundBlog)
})

blogsRouter.post('/', ...blogValidators, (req, res) => {
    const newBlogID = blogsRepository.createBlog(req.body);
    if (!newBlogID) {
        res.sendStatus(400)
        return
    }
    const foundBlog = blogsRepository.getBlogByID(newBlogID);
    res.status(201).json(foundBlog)
})

blogsRouter.put('/:id', ...blogValidators, (req, res) => {
    const isBlogUpdated = blogsRepository.updateBlog(req.params.id, req.body);
    if (!isBlogUpdated) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})

blogsRouter.delete('/:id', baseAuthMiddleware, (req, res) => {
    const isBlogDeleted = blogsRepository.deleteBlog(req.params.id)
    if (!isBlogDeleted) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})

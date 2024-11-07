import { Router } from "express";
import { baseAuthMiddleware } from "../../global-middlewares/base-auth-middleware";
import { blogValidators } from "./middlewares/blog-validators";
import { blogsService } from "./services/blogs-service";
import { contentValidator, shortDescriptionValidator, titleValidator } from "../posts/middlewares/post-validators";
import { inputCheckErrorsMiddleware } from "../../global-middlewares/input-Check-Errors-Middleware";

export const blogsRouter = Router({})

blogsRouter.get('/', async (req, res) => {

    const allBlogs = await blogsService.findBlogs(req.query)
    res.status(200).json(allBlogs)

})

blogsRouter.get('/:id', async (req, res) => {

    const foundBlog = await blogsService.findBlogById(req.params.id);
    if (!foundBlog) {
        res.sendStatus(404)
        return
    }
    res.status(200).json(foundBlog)

})

blogsRouter.get('/:id/posts', async (req, res) => {

    const foundBlog = await blogsService.findBlogPosts(req.params.id);
    if (!foundBlog) {
        res.sendStatus(404)
        return
    }
    res.status(200).json(foundBlog)

})

blogsRouter.post('/', ...blogValidators, async (req, res) => {

    const newBblog = await blogsService.createBlog(req.body);
    if (!newBblog) {
        res.sendStatus(400)
        return
    }
    res.status(201).json(newBblog)

})

blogsRouter.post('/:id/posts',
    baseAuthMiddleware,
    titleValidator,
    shortDescriptionValidator,
    contentValidator,
    inputCheckErrorsMiddleware, async (req, res) => {

        const newBblogPost = await blogsService.createBlogPost(req.params.id, req.body);
        if (!newBblogPost) {
            res.sendStatus(400)
            return
        }
        res.status(201).json(newBblogPost)

    })

blogsRouter.put('/:id', ...blogValidators, async (req, res) => {

    const isBlogUpdated = await blogsService.updateBlog(req.params.id, req.body);
    if (!isBlogUpdated) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)

})

blogsRouter.delete('/:id', baseAuthMiddleware, async (req, res) => {

    const isBlogDeleted = await blogsService.deleteBlog(req.params.id)
    if (!isBlogDeleted) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)

})

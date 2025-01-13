import { Router } from "express";
import { baseAuthMiddleware } from "../../global-middlewares/base-auth-middleware";
import { blogValidators } from "./middlewares/blog-validators";
import { blogsService } from "./services/blogs-service";
import { contentValidator, shortDescriptionValidator, titleValidator } from "../posts/middlewares/post-validators";
import { inputCheckErrorsMiddleware } from "../../global-middlewares/input-Check-Errors-Middleware";
import { blogsQueryService } from "./services/blogs-query-service";

export const blogsRouter = Router({})

blogsRouter.get('/', async (req, res) => {
    const serviceRes = await blogsQueryService.findBlogs(req.query)
    res.status(serviceRes.status).json(serviceRes.data)
})

blogsRouter.get('/:id', async (req, res) => {
    const serviceRes = await blogsQueryService.findBlogById(req.params.id);
    if (!serviceRes.result) {
        res.sendStatus(serviceRes.status)
        return
    }

    res.status(serviceRes.status).json(serviceRes.data)
})

blogsRouter.get('/:id/posts', async (req, res) => {
    const serviceRes = await blogsQueryService.findBlogById(req.params.id);
    if (!serviceRes.result) {
        res.sendStatus(serviceRes.status)
        return
    }

    const foundPostsOfBlog = await blogsQueryService.findPostsOfBlog(req.params.id, req.query);
    res.status(foundPostsOfBlog.status).json(foundPostsOfBlog.data)
})

blogsRouter.post('/', ...blogValidators, async (req, res) => {
    const serviceRes = await blogsService.createBlog(req.body);
    res.status(serviceRes.status).json(serviceRes.data)
})

blogsRouter.post('/:id/posts',
    baseAuthMiddleware,
    titleValidator,
    shortDescriptionValidator,
    contentValidator,
    inputCheckErrorsMiddleware, async (req, res) => {

        const blog = await blogsQueryService.findBlogById(req.params.id);
        if (!blog.result) {
            res.sendStatus(blog.status)
            return
        }

        const newBblogPost = await blogsService.createBlogPost(req.params.id, req.body);
        if (!newBblogPost.result) {
            res.sendStatus(newBblogPost.status)
            return
        }
        res.status(newBblogPost.status).json(newBblogPost.data)
    })

blogsRouter.put('/:id', ...blogValidators, async (req, res) => {
    const serviceRes = await blogsService.updateBlog(req.params.id, req.body);
    if (!serviceRes.result) {
        res.sendStatus(serviceRes.status)
        return
    }

    res.status(serviceRes.status).json(serviceRes.data)
})

blogsRouter.delete('/:id', baseAuthMiddleware, async (req, res) => {
    const serviceRes = await blogsService.deleteBlog(req.params.id)
    if (!serviceRes.result) {
        res.sendStatus(serviceRes.status)
        return
    }

    res.status(serviceRes.status).json(serviceRes.data)
})

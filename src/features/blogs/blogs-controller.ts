import { Request, Response } from "express"
import { inject, injectable } from "inversify"
import { BlogsService } from "./services/blogs-service";
import { BlogsQueryService } from "./services/blogs-query-service";

@injectable()
export class BlogsController {
    constructor(
        private blogsService: BlogsService,
        private blogsQueryService: BlogsQueryService
    ) { }

    async findAllBlogs(req: Request, res: Response) {
        const serviceRes = await this.blogsQueryService.findBlogs(req.query)
        res.status(serviceRes.status).json(serviceRes.data)
    }

    async getBlogById(req: Request, res: Response) {
        const serviceRes = await this.blogsQueryService.findBlogById(req.params.id);
        if (!serviceRes.result) {
            res.sendStatus(serviceRes.status)
            return
        }

        res.status(serviceRes.status).json(serviceRes.data)
    }

    async getPostsOfBlog(req: Request, res: Response) {
        const serviceRes = await this.blogsQueryService.findBlogById(req.params.id);
        if (!serviceRes.result) {
            res.sendStatus(serviceRes.status)
            return
        }

        const foundPostsOfBlog = await this.blogsQueryService.findPostsOfBlog(req.params.id, req.query);
        res.status(foundPostsOfBlog.status).json(foundPostsOfBlog.data)
    }

    async createBlog(req: Request, res: Response) {
        const serviceRes = await this.blogsService.createBlog(req.body);
        res.status(serviceRes.status).json(serviceRes.data)
    }

    async createPostToBlog(req: Request, res: Response) {

        const blog = await this.blogsQueryService.findBlogById(req.params.id);
        if (!blog.result) {
            res.sendStatus(blog.status)
            return
        }

        const newBblogPost = await this.blogsService.createBlogPost(req.params.id, req.body);
        if (!newBblogPost.result) {
            res.sendStatus(newBblogPost.status)
            return
        }
        res.status(newBblogPost.status).json(newBblogPost.data)
    }

    async updateBlog(req: Request, res: Response) {
        const serviceRes = await this.blogsService.updateBlog(req.params.id, req.body);
        if (!serviceRes.result) {
            res.sendStatus(serviceRes.status)
            return
        }

        res.status(serviceRes.status).json(serviceRes.data)
    }

    async deleteBlog(req: Request, res: Response) {
        const serviceRes = await this.blogsService.deleteBlog(req.params.id)
        if (!serviceRes.result) {
            res.sendStatus(serviceRes.status)
            return
        }

        res.status(serviceRes.status).json(serviceRes.data)
    }
}
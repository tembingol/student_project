import { Router } from "express";
import { baseAuthMiddleware } from "../../global-middlewares/base-auth-middleware";
import { blogValidators } from "./middlewares/blog-validators";
import { contentValidator, shortDescriptionValidator, titleValidator } from "../posts/middlewares/post-validators";
import { inputCheckErrorsMiddleware } from "../../global-middlewares/input-Check-Errors-Middleware";
import { BlogsController } from "./blogs-controller";
import { container } from "../../composition-root";


export const blogsRouter = Router({})

const blogsController = container.get(BlogsController)

blogsRouter.get('/', blogsController.findAllBlogs.bind(blogsController))

blogsRouter.get('/:id', blogsController.getBlogById.bind(blogsController))

blogsRouter.get('/:id/posts', blogsController.getPostsOfBlog.bind(blogsController))

blogsRouter.post('/', ...blogValidators, blogsController.createBlog.bind(blogsController))

blogsRouter.post('/:id/posts',
    baseAuthMiddleware,
    titleValidator,
    shortDescriptionValidator,
    contentValidator,
    inputCheckErrorsMiddleware, blogsController.createPostToBlog.bind(blogsController))

blogsRouter.put('/:id', ...blogValidators, blogsController.updateBlog.bind(blogsController))

blogsRouter.delete('/:id', baseAuthMiddleware, blogsController.deleteBlog.bind(blogsController))

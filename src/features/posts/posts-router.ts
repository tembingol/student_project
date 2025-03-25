import { Router } from "express";
import { baseAuthMiddleware } from "../../global-middlewares/base-auth-middleware";
import { postValidators } from "./middlewares/post-validators";
import { commentValidators } from "../comments/middlewares/comments-validators";
import { authMiddleware } from "../../global-middlewares/jwt-auth-middleware";
import { PostsController } from "./posts-controller";
import { container } from "../../composition-root";

export const postsRouter = Router({})

const postsController = container.get(PostsController)

postsRouter.get('/', postsController.getAllPosts.bind(postsController))

postsRouter.get('/:id', postsController.getPostById.bind(postsController))

postsRouter.get('/:id/comments', postsController.getCommentsOfPost.bind(postsController))

postsRouter.post('/:id/comments', authMiddleware, ...commentValidators, postsController.addCommentToPost.bind(postsController))

postsRouter.post('/', ...postValidators, postsController.createPost.bind(postsController))

postsRouter.put('/', ...postValidators, postsController.updatePost.bind(postsController))

postsRouter.delete('/', baseAuthMiddleware, postsController.deletePost.bind(postsController))
import { Router } from "express"
import { commentValidators } from "./middlewares/comments-validators"
import { authMiddleware } from "../../global-middlewares/jwt-auth-middleware"
import { CommentsController } from "./comments-controller"
import { container } from "../../composition-root"

export const commentsRouter = Router({})

const commentsController = container.get(CommentsController)

commentsRouter.get('/:id', commentsController.findCommentById.bind(commentsController))

commentsRouter.put('/:id', authMiddleware, ...commentValidators, commentsController.updateComment.bind(commentsController))

commentsRouter.delete('/:id', authMiddleware, commentsController.deleteComment.bind(commentsController))

commentsRouter.put('/:id/like-status', authMiddleware, commentsController.updateLikeStatus.bind(commentsController))
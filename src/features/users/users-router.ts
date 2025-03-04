import { Router } from "express"
import { userRegistrationValidators } from "./middlewares/users-validators"
import { baseAuthMiddleware } from "../../global-middlewares/base-auth-middleware"
import { usersController } from "../../composition-root"

export const usersRouter = Router({})

usersRouter.get('/', usersController.findUsers.bind(usersController))

usersRouter.post('/', baseAuthMiddleware, ...userRegistrationValidators, usersController.createUser.bind(usersController))

usersRouter.delete('/:id', baseAuthMiddleware, usersController.deleteUser.bind(usersController))
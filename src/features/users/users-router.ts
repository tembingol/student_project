import { Router } from "express"
import { userRegistrationValidators } from "./middlewares/users-validators"
import { baseAuthMiddleware } from "../../global-middlewares/base-auth-middleware"
import { UsersController } from "./users-controller"
import { container } from "../../composition-root"

export const usersRouter = Router({})

const usersController = container.get(UsersController)

usersRouter.get('/', usersController.findUsers.bind(usersController))

usersRouter.post('/', baseAuthMiddleware, ...userRegistrationValidators, usersController.createUser.bind(usersController))

usersRouter.delete('/:id', baseAuthMiddleware, usersController.deleteUser.bind(usersController))
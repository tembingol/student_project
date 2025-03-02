import { Router } from "express"
import { userRegistrationValidators } from "./middlewares/users-validators"
import { baseAuthMiddleware } from "../../global-middlewares/base-auth-middleware"
import { UsersQueryService } from "./services/usersQueryService"
import { UsersQueryRepository } from "./repo/UsersQueryRepo"
import { UsersRepository } from "./repo/UserRepo"
import { UsersService } from "./services/usersService"
import { UsersController } from "./usersController"

export const usersRouter = Router({})

const usersQueryRepository = new UsersQueryRepository()
const usersRepository = new UsersRepository()
const usersQueryService = new UsersQueryService(usersQueryRepository)
const usersService = new UsersService(usersQueryService, usersQueryRepository, usersRepository)
const usersController = new UsersController(usersService, usersQueryService)

usersRouter.get('/', usersController.findUsers.bind(usersController))

usersRouter.post('/', baseAuthMiddleware, ...userRegistrationValidators, usersController.createUser.bind(usersController))

usersRouter.delete('/:id', baseAuthMiddleware, usersController.deleteUser.bind(usersController))
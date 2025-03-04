
import { AuthController } from "./features/auth/auth-controller"
import { AuthRepository } from "./features/auth/repo/auth-repository"
import { AuthService } from "./features/auth/services/auth-service"
import { UsersRepository } from "./features/users/repo/Users-repository"
import { UsersQueryRepository } from "./features/users/repo/UsersQuery-repository"
import { UsersQueryService } from "./features/users/services/usersQuery-service"
import { UsersService } from "./features/users/services/users-service"
import { UsersController } from "./features/users/users-controller"

//Users + 
const usersQueryRepository = new UsersQueryRepository()
const usersRepository = new UsersRepository()
const usersQueryService = new UsersQueryService(usersQueryRepository)
const usersService = new UsersService(usersQueryService, usersQueryRepository, usersRepository)

export const usersController = new UsersController(usersService, usersQueryService)
//Users -

//Auth +
const authRepository = new AuthRepository()
const authService = new AuthService(usersQueryService, usersQueryRepository, usersService, usersRepository, authRepository)

export const authController = new AuthController(authService, usersQueryService)
//Auth -
import { Router } from "express"
import { authRegistrationValidators, authLoginValidators } from "./middlewares/auth-validators"
import { refteshTokenValidator } from "./middlewares/refreshToken-validator"
import { incomingRequestsCheckMiddleware } from "../../global-middlewares/sessions-middleware"
import { accessTokenValidator } from "./middlewares/accessToken-validator"
import { AuthService } from "./services/authService"
import { UsersQueryService } from "../users/services/usersQueryService"
import { AuthController } from "./authController"
import { UsersQueryRepository } from "../users/repo/UsersQueryRepo"
import { UsersRepository } from "../users/repo/UserRepo"
import { UsersService } from "../users/services/usersService"

export const authRouter = Router({})

const usersQueryRepository = new UsersQueryRepository
const usersQueryService = new UsersQueryService(usersQueryRepository)
const usersRepository = new UsersRepository()
const usersService = new UsersService(usersQueryService, usersQueryRepository, usersRepository)
const authService = new AuthService(usersQueryService, usersQueryRepository, usersService, usersRepository)

const authController = new AuthController(authService, usersQueryService)

authRouter.post('/registration', incomingRequestsCheckMiddleware, ...authRegistrationValidators, authController.registration.bind(authController))

authRouter.post('/registration-confirmation', incomingRequestsCheckMiddleware, authController.registrationConfirmation.bind(authController))

authRouter.post('/registration-email-resending', incomingRequestsCheckMiddleware, authController.registrationEmailResending.bind(authController))

authRouter.post('/login', incomingRequestsCheckMiddleware, ...authLoginValidators, authController.login.bind(authController))

authRouter.post('/logout', authController.logout.bind(authController))

authRouter.post('/refresh-token', refteshTokenValidator, authController.refreshTokens.bind(authController))

authRouter.get('/login/me', accessTokenValidator, authController.getMe.bind(authController))

authRouter.get('/me', accessTokenValidator, authController.getMe.bind(authController))
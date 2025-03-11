import { Router } from "express"
import { authRegistrationValidators, authLoginValidators, authNewPasswordValidators } from "./middlewares/auth-validators"
import { refteshTokenValidator } from "./middlewares/refreshToken-validator"
import { incomingRequestsCheckMiddleware } from "../../global-middlewares/sessions-middleware"
import { accessTokenValidator } from "./middlewares/accessToken-validator"
import { AuthController } from "./auth-controller"
import { container } from "../../composition-root"

export const authRouter = Router({})

const authController = container.get(AuthController)

authRouter.post('/registration', incomingRequestsCheckMiddleware, ...authRegistrationValidators, authController.registration.bind(authController))

authRouter.post('/registration-confirmation', incomingRequestsCheckMiddleware, authController.registrationConfirmation.bind(authController))

authRouter.post('/registration-email-resending', incomingRequestsCheckMiddleware, authController.registrationEmailResending.bind(authController))

authRouter.post('/login', incomingRequestsCheckMiddleware, ...authLoginValidators, authController.login.bind(authController))

authRouter.post('/logout', authController.logout.bind(authController))

authRouter.post('/refresh-token', refteshTokenValidator, authController.refreshTokens.bind(authController))

authRouter.get('/login/me', accessTokenValidator, authController.getMe.bind(authController))

authRouter.get('/me', accessTokenValidator, authController.getMe.bind(authController))

authRouter.post('/password-recovery', incomingRequestsCheckMiddleware, authController.passwordRecovery.bind(authController))

authRouter.post('/new-password', incomingRequestsCheckMiddleware, authNewPasswordValidators, authController.setNewPassword.bind(authController))
import { Request, Response } from "express"
import { AuthService } from "./services/auth-service"
import { HTTP_STATUS_CODE } from "../../input-output-types/types"
import { UsersQueryService } from "../users/services/usersQuery-service"

export class AuthController {

    constructor(
        private authService: AuthService,
        private usersQueryService: UsersQueryService
    ) { }

    async registration(req: Request, res: Response) {

        const serviceRes = await this.authService.registerNewUser(req.body)
        if (serviceRes.result) {
            res.status(serviceRes.status).json(serviceRes.data)
            return
        }
        res.status(serviceRes.status).json(serviceRes.errors)
    }

    async registrationConfirmation(req: Request, res: Response) {

        const serviceRes = await this.authService.confirmEmail(req.body)
        if (serviceRes.result) {
            res.status(serviceRes.status).json(serviceRes.data)
            return
        }
        res.status(serviceRes.status).json(serviceRes.errors)
    }

    async registrationEmailResending(req: Request, res: Response) {

        const serviceRes = await this.authService.resendRegistrationEmail(req.body)
        if (serviceRes.result) {
            res.status(serviceRes.status).json(serviceRes.data)
            return
        }
        res.status(serviceRes.status).json(serviceRes.errors)
    }

    async login(req: Request, res: Response) {
        const foundUser = await this.authService.checkUserCredintails(req.body)
        if (foundUser === null) {
            res.sendStatus(401)
            return
        }
        if (!req.context) {
            res.sendStatus(502)
            return
        }
        const serviceRes = await this.authService.loginUser(foundUser, req.context.userDeviceInfo)
        if (!serviceRes.result) {
            res.status(serviceRes.status).json(serviceRes.errors)
            return
        }
        const accessToken = serviceRes.data.accessToken
        const refreshToken = serviceRes.data.refreshToken
        const ssid = serviceRes.data.deviceId
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, })
        res.cookie('ssid', ssid, { httpOnly: true, secure: true, })
        res.status(200).send({ accessToken: accessToken })
    }

    async logout(req: Request, res: Response) {

        const refreshToken = req.cookies.refreshToken

        if (refreshToken === undefined) {
            res.sendStatus(HTTP_STATUS_CODE.Unauthorized)
            return
        }

        const serviceRes = await this.authService.logoutUser(refreshToken as string)

        if (!serviceRes.result) {
            res.status(serviceRes.status).json(serviceRes.data)
            return
        }

        res.clearCookie('refreshToken', { httpOnly: true, secure: true, })
        res.clearCookie('ssid', { httpOnly: true, secure: true, })
        res.sendStatus(HTTP_STATUS_CODE.NoContent)
    }

    async refreshTokens(req: Request, res: Response) {

        const refreshToken = req.cookies.refreshToken

        if (!req.context) {
            res.sendStatus(502)
            return
        }

        const serviceRes = await this.authService.refreshTokens(refreshToken, req.context.currentUser.userId)

        if (!serviceRes.result) {
            res.status(serviceRes.status).json(serviceRes.errors)
            return
        }

        const ssid = serviceRes.data.deviceId
        const newAccessToken = serviceRes.data.accessToken
        const newRefreshToken = serviceRes.data.refreshToken

        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, })
        res.cookie('ssid', ssid, { httpOnly: true, secure: true, })

        res.status(HTTP_STATUS_CODE.OK).send({ accessToken: newAccessToken })

    }

    async getMe(req: Request, res: Response) {

        if (!req.context) {
            res.sendStatus(502)
            return
        }

        const currentUser = req.context.currentUser
        const foundUser = await this.usersQueryService.getUserById(currentUser.userId)

        if (!foundUser) {
            res.sendStatus(HTTP_STATUS_CODE.Unauthorized)
            return
        }

        res.status(HTTP_STATUS_CODE.OK).send(foundUser)

    }

    async passwordRecovery(req: Request, res: Response) {

        const serviceRes = await this.authService.passwordRecovery(req.body)

        if (!serviceRes.result) {
            res.status(serviceRes.status).json(serviceRes.errors)
            return
        }

        res.sendStatus(HTTP_STATUS_CODE.NoContent)
    }

    async setNewPassword(req: Request, res: Response) {

        const serviceRes = await this.authService.setNewPassword(req.body)

        if (!serviceRes.result) {
            res.status(serviceRes.status).json(serviceRes.errors)
            return
        }

        res.status(serviceRes.status).json(serviceRes.data)
    }
}

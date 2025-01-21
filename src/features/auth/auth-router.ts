import { Router } from "express"
import { authRegistrationValidators, authLoginValidators } from "./middlewares/auth-validators"
import { authService } from "./services/auth-service"
import { HTTP_STATUS_CODE } from "../../input-output-types/types"
import { refteshTokenValidator } from "./middlewares/refreshToken-validator"
import { incomingRequestsCheckMiddleware } from "../../global-middlewares/sessions-middleware"

export const authRouter = Router({})

authRouter.post('/registration', incomingRequestsCheckMiddleware, ...authRegistrationValidators, async (req, res) => {

    const serviceRes = await authService.registerNewUser(req.body)
    if (serviceRes.result) {
        res.status(serviceRes.status).json(serviceRes.data)
        return
    }
    res.status(serviceRes.status).json(serviceRes.errors)
})

authRouter.post('/registration-confirmation', incomingRequestsCheckMiddleware, async (req, res) => {

    const serviceRes = await authService.confirmEmail(req.body)
    if (serviceRes.result) {
        res.status(serviceRes.status).json(serviceRes.data)
        return
    }
    res.status(serviceRes.status).json(serviceRes.errors)
})

authRouter.post('/registration-email-resending', incomingRequestsCheckMiddleware, async (req, res) => {

    const serviceRes = await authService.resendRegistrationEmail(req.body)
    if (serviceRes.result) {
        res.status(serviceRes.status).json(serviceRes.data)
        return
    }
    res.status(serviceRes.status).json(serviceRes.errors)
})

authRouter.post('/login', incomingRequestsCheckMiddleware, ...authLoginValidators, async (req, res) => {

    const foundUser = await authService.checkUserCredintails(req.body)

    if (foundUser === null) {
        res.sendStatus(401)
        return
    }

    if (!req.context) {
        res.sendStatus(502)
        return
    }

    const serviceRes = await authService.loginUser(foundUser, req.context.userDeviceInfo)

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
})

authRouter.post('/logout', async (req, res) => {

    const refreshToken = req.cookies.refreshToken

    if (refreshToken === undefined) {
        res.sendStatus(HTTP_STATUS_CODE.Unauthorized)
        return
    }

    const serviceRes = await authService.logoutUser(refreshToken as string)

    if (!serviceRes.result) {
        res.status(serviceRes.status).json(serviceRes.data)
        return
    }

    res.clearCookie('refreshToken', { httpOnly: true, secure: true, })
    res.clearCookie('ssid', { httpOnly: true, secure: true, })
    res.sendStatus(HTTP_STATUS_CODE.NoContent)
})

authRouter.post('/refresh-token', refteshTokenValidator, async (req, res) => {

    const refreshToken = req.cookies.refreshToken

    if (!req.context) {
        res.sendStatus(502)
        return
    }

    const serviceRes = await authService.refreshTokens(refreshToken, req.context.userDeviceInfo)

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

})

authRouter.get('/login/me', async (req, res) => {

    const authorization = req.headers['Authorization'.toLowerCase()]

    if (authorization == undefined) {
        res.sendStatus(HTTP_STATUS_CODE.Unauthorized)
        return
    }

    const accessToken = authorization.slice(7)

    const foundUser = await authService.getUserByToken(accessToken.toString())

    if (foundUser === null) {
        res.sendStatus(HTTP_STATUS_CODE.Unauthorized)
        return
    }

    res.status(HTTP_STATUS_CODE.OK).send(foundUser)

})

authRouter.get('/me', async (req, res) => {

    const authorization = req.headers['Authorization'.toLowerCase()]
    if (authorization == undefined) {
        res.sendStatus(HTTP_STATUS_CODE.Unauthorized)
        return
    }

    const accessToken = authorization.slice(7)

    const foundUser = await authService.getUserByToken(accessToken.toString())

    if (foundUser === null) {
        res.sendStatus(HTTP_STATUS_CODE.Unauthorized)
        return
    }

    res.status(HTTP_STATUS_CODE.OK).send(foundUser)

})
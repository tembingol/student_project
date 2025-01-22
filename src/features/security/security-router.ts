import { Router } from "express"
import { HTTP_STATUS_CODE } from "../../input-output-types/types"
import { securityService } from "./services/security-service"
import { sessionService } from "../../application-services/sessions-service"
import { refteshTokenValidator } from "../auth/middlewares/accessToken-validator"


export const securityRouter = Router({})

securityRouter.get('/devices', refteshTokenValidator, async (req, res) => {

    const refreshToken = req.cookies.refreshToken

    const allDevices = await securityService.getAllDevices(refreshToken)

    res.status(HTTP_STATUS_CODE.OK).json(allDevices)

})

securityRouter.delete('/devices', refteshTokenValidator, async (req, res) => {

    const deviceId = req.context?.userDeviceInfo.deviceId
    const refreshToken = req.cookies.refreshToken

    if (!deviceId) {
        res.sendStatus(HTTP_STATUS_CODE.Unauthorized)
        return
    }

    const result = await securityService.deleteAllDevices(refreshToken)

    if (result) {
        res.status(HTTP_STATUS_CODE.NoContent).json({})
        return
    }

    res.status(HTTP_STATUS_CODE.NoContent).json({ message: `deleteAllDevices ${result}` })

})

securityRouter.delete('/devices/:deviceId', refteshTokenValidator, async (req, res) => {

    const deviceId = req.params.deviceId
    if (!deviceId) {
        res.sendStatus(HTTP_STATUS_CODE.NotFound)
        return
    }

    const serviceResponse = await sessionService.deleteDeviceByID(req.cookies.refreshToken, deviceId)

    if (!serviceResponse.result) {
        res.sendStatus(serviceResponse.status)
        return
    }

    res.status(serviceResponse.status).json(serviceResponse.data)

})
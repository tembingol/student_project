import { Request, NextFunction, Response } from "express"
import { jwtService } from "../application-services/JWT-service"
import { HTTP_STATUS_CODE } from "../input-output-types/types"

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization

    if (!authorization) {
        res.status(HTTP_STATUS_CODE.Unauthorized).json({})
        return
    }

    const useraccessToken = authorization.split(' ')[1]

    let foundUser = await jwtService.getUserFromToken(useraccessToken)

    if (foundUser === null) {
        res.sendStatus(HTTP_STATUS_CODE.Unauthorized)
        return
    }

    if (req.context === undefined) {
        req.context = {
            currentUser: foundUser,
            userDeviceInfo: {
                deviceId: "",
                deviceName: "",
                deviceIp: "",
            }
        }
    } else {
        req.context.currentUser = foundUser
    }

    next()
}

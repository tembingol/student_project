import { Request, Response, NextFunction } from "express"
import { v4 as uuidv4 } from 'uuid';
import { sessionsRepository } from "../application-services/sessions-repository";
import { IncomingRequestsModel } from "../input-output-types/sessions-models";
import { sessionService } from "../application-services/sessions-service";
import { HTTP_STATUS_CODE } from "../input-output-types/types";
import { jwtService } from "../application-services/JWT-service";

// Middleware to add session metadata
export const sessionMetadataMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const deviceInfo = getDeviceInfo(req)
    const currentUser = await getUserInfo(req)

    if (req.context === undefined) {
        req.context = {
            currentUser: currentUser,
            userDeviceInfo: deviceInfo
        }
    } else {
        req.context.currentUser = currentUser
        req.context.userDeviceInfo = deviceInfo
    }

    next()
}

// Middleware to add sessionCounter
export const incomingRequestsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const deviceInfo = getDeviceInfo(req)

    const newIncomingRequest: IncomingRequestsModel = {
        Ip: deviceInfo.deviceIp,
        URL: req.url,
        Date: new Date()
    }

    await sessionsRepository.addIncomingRequest(newIncomingRequest)

    next()
}

// Middleware to add sessionCounter
export const incomingRequestsCheckMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const deviceInfo = getDeviceInfo(req)
    const url = req.baseUrl + req.url
    const reqAmount = await sessionService.getInconingRequestsAmount(deviceInfo.deviceIp, url)

    if (reqAmount > 5) {
        res.status(HTTP_STATUS_CODE.TooManyRequests).json({ message: "Too many requests" })
        return
    }

    next()
}

function getDeviceInfo(req: Request) {
    const deviceName = req.headers['user-agent'] === undefined ? 'Unknown device' : req.headers['user-agent'];
    const deviceIp = req.headers['host'] === undefined ? 'Unknown host' : req.headers['host'];
    const deviceId = req.cookies.ssid === undefined ? uuidv4() : req.cookies.ssid;
    return { deviceId, deviceName, deviceIp };
}


const getUserInfo = async (req: Request) => {

    const userData = { userId: '', userLogin: '' }

    const authorization = req.headers.authorization

    if (!authorization) {
        return userData
    }

    const useraccessToken = authorization.split(' ')[1]

    let foundUser = await jwtService.getUserFromToken(useraccessToken)

    if (foundUser === null) {
        return userData
    }

    return foundUser

}
import Jwt from "jsonwebtoken";
import { UserViewModel } from '../input-output-types/users-moduls';
import { jwtService } from './JWT-service';
import { sessionsRepository } from './sessions-repository';
import { SessionDataBaseModel, SessionViewModel } from '../input-output-types/sessions-models';
import { HTTP_STATUS_CODE, ServicesResponseNew, TokenPlayLoadType, UserDeviceInfoType } from '../input-output-types/types';
import { subSeconds, format, compareAsc, } from "date-fns";
const jwt = Jwt;

export const sessionService = {

    async addSession(user: UserViewModel, refreshToken: string, userDeviceInfo: UserDeviceInfoType) {
        const tokenData = await jwtService.decodeToken(refreshToken)

        const newSession: SessionDataBaseModel = {
            user_id: user.id,
            device_id: userDeviceInfo.deviceId,
            iat: new Date(tokenData.iat * 1000),
            device_name: userDeviceInfo.deviceName,
            ip: userDeviceInfo.deviceIp,
            exp: new Date(tokenData.exp * 1000),
        }

        console.log('newSession', newSession)
        const sessionId = await sessionsRepository.addSession(newSession)

        return sessionId
    },

    async updateSession(sessionId: string, refreshToken: string,) {
        const newTokenData = await jwtService.decodeToken(refreshToken)

        const newSession = {
            iat: new Date(newTokenData.iat * 1000),
            exp: new Date(newTokenData.exp * 1000),
        }

        const sessionUpdated = await sessionsRepository.updateSession(sessionId, newSession)

        return sessionUpdated
    },

    async getCurrentSession(tokenPlayLoad: TokenPlayLoadType) {

        const filter = {
            $and: [
                { user_id: tokenPlayLoad.userId },
                { device_id: tokenPlayLoad.deviceId },
                { iat: new Date(tokenPlayLoad.iat * 1000) }]
        }

        const foundSession = await sessionsRepository.getSession(filter)

        if (!foundSession) {
            return null
        }

        return sessionEntityMapper(foundSession)
    },

    async getSessionById(sessionId: string,) {

        const filter: Partial<SessionDataBaseModel> = {
            device_id: sessionId
        }

        const foundSession = await sessionsRepository.getSession(filter)

        if (!foundSession) {
            return null
        }

        return sessionEntityMapper(foundSession)
    },

    async deleteSession(refreshToken: string) {

        const tokenPlayLoad = await jwtService.decodeToken(refreshToken)

        const userSession = await sessionService.getCurrentSession(tokenPlayLoad)
        if (userSession === null) {
            return false
        }
        const result = await sessionsRepository.deleteSession(userSession.id)
        return result

    },

    async getInconingRequestsAmount(ip: string, url: string) {
        const filter = {
            $and: [{ Ip: ip }, { URL: url }, { Date: { $gt: subSeconds(new Date(), 10) } }]
        }
        return await sessionsRepository.getIncomingRequestsCount(filter)
    },

    async deleteDeviceByID(refreshToken: string, deviceId: string) {
        const serviceResponse: ServicesResponseNew<{}> = {
            result: false,
            status: HTTP_STATUS_CODE.NoContent,
            data: {},
            errors: { errorsMessages: [] }
        }

        const session = await sessionService.getSessionById(deviceId)
        if (session === null) {
            serviceResponse.status = HTTP_STATUS_CODE.NotFound
            return serviceResponse
        }

        const tokenPlayLoad = await jwtService.decodeToken(refreshToken)
        if (!tokenPlayLoad) {
            return serviceResponse
        }

        const userSession = await sessionService.getCurrentSession(tokenPlayLoad)

        if (userSession === null) {
            serviceResponse.status = HTTP_STATUS_CODE.NotFound
            return serviceResponse
        }

        if (tokenPlayLoad.deviceId !== deviceId) {
            serviceResponse.status = HTTP_STATUS_CODE.Forbidden
            return serviceResponse
        }

        if (tokenPlayLoad.userId !== userSession.user_id) {
            serviceResponse.status = HTTP_STATUS_CODE.Forbidden
            return serviceResponse
        }

        serviceResponse.result = await sessionsRepository.deleteSession(userSession.id)
        return serviceResponse

    }


};

export function sessionEntityMapper(session: SessionDataBaseModel): SessionViewModel {
    return {
        id: session._id!.toString(),
        user_id: session.user_id,
        device_id: session.device_id,
        device_name: session.device_name,
        ip: session.ip,
        iat: session.iat,
        exp: session.exp,
    }
}

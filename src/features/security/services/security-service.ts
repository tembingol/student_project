import { jwtService } from "../../../application-services/JWT-service"
import { DeviceViewModel } from "../../../input-output-types/devices-models"
import { SessionDataBaseModel } from "../../../input-output-types/sessions-models"
import { TokenPlayLoadType } from "../../../input-output-types/types"
import { securityQueryRepository } from "../security-query-repository"
import { securityRepository } from "../security-repository"


export const securityService = {

    async getAllDevices(refreshToken: string) {

        const playLoad = await jwtService.tokenVerify(refreshToken) as TokenPlayLoadType

        if (!playLoad || playLoad.userId === undefined) {
            return []
        }

        const filter = { user_id: playLoad.userId }

        let allDevices = await securityQueryRepository.getAllDevices(filter)
        const mappedAllDevices = allDevices.map((el) => deviceMapper(el))
        return mappedAllDevices

    },

    async deleteAllDevices(refreshToken: string) {

        const playLoad = await jwtService.tokenVerify(refreshToken) as TokenPlayLoadType

        if (!playLoad || playLoad.userId === undefined) {
            return false
        }
        const filter = { $and: [{ user_id: playLoad.userId }, { device_id: { $ne: playLoad.deviceId } }] }
        // const filter = { device_id: { $ne: deviceId } }
        const resalt = await securityRepository.deleteAllDevices(filter)
        return resalt

    },

    async deleteDeviceByID(deviceId: string) {

        const resalt = await securityRepository.deleteDeviceByID(deviceId)
        return resalt

    },

}

function deviceMapper(deviceSession: SessionDataBaseModel): DeviceViewModel {
    return {
        ip: deviceSession.ip,//IP address of device during signing in
        title: deviceSession.device_name,//Device name: for example Chrome 105 (received by parsing http header "user-agent")
        lastActiveDate: new Date(deviceSession.iat),//Date of the last generating of refresh/access tokens
        deviceId: deviceSession.device_id,//Id of connected device session
    }
}
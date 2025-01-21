import { UserViewModel } from "../input-output-types/users-moduls";
import Jwt from "jsonwebtoken";
import { SETTINGS } from "../settings";
const jwt = Jwt;

export const jwtService = {

    async createAccsessJWT(user: UserViewModel) {
        const accessToken = await jwt.sign({ userId: user.id, userLogin: user.login }, SETTINGS.JWT_SECRET, { expiresIn: SETTINGS.ACCESSTOKEN_TTL })
        return accessToken
    },

    async createRefreshJWT(user: UserViewModel, deviceID: string) {
        const refreshToken = await jwt.sign({ userId: user.id, userLogin: user.login, deviceId: deviceID }, SETTINGS.JWT_SECRET, { expiresIn: SETTINGS.REFRESHTOKEN_TTL })
        return refreshToken
    },

    async tokenVerify(token: string) {
        if (token === '') {
            return null
        }
        try {
            const decoded = await jwt.verify(token, SETTINGS.JWT_SECRET)
            return typeof decoded === 'object' ? { ...decoded } : null;
        } catch (err) {
            console.log('JWT is not valid ', token)
        }
        return null
    },

    async getUserFromToken(token: string) {
        try {
            const playLoad = await jwt.verify(token, SETTINGS.JWT_SECRET)
            return typeof playLoad === 'object' ? { userId: playLoad.userId, userLogin: playLoad.userLogin } : null;
        } catch (err) {
            console.log('JWT is not valid ', token)
        }
        return null
    },

    async decodeToken(token: string) {
        const decoded = await jwt.decode(token);

        return { ...decoded as any }
    },

}
import { UserViewModel } from "../input-output-types/users-moduls";
import Jwt from "jsonwebtoken";
import { SETTINGS } from "../settings";
import { ExpiredTokensModel } from "../input-output-types/expired-tokens-models";
import { expiredTokensRepository } from "./JWT-repository";
const jwt = Jwt;

export const jwtService = {

    async createAccsessJWT(user: UserViewModel) {
        const accessToken_JWT = await jwt.sign({ userId: user.id, userLogin: user.login }, SETTINGS.JWT_SECRET, { expiresIn: 10 })
        return accessToken_JWT
    },

    async createRefreshJWT(user: UserViewModel) {
        const refreshToken_JWT = await jwt.sign({ userId: user.id, userLogin: user.login }, SETTINGS.JWT_SECRET, { expiresIn: 20 })
        return refreshToken_JWT
    },

    async getUserIdFromToken(token: string) {
        try {
            const result = await jwt.verify(token, SETTINGS.JWT_SECRET)
            if (typeof result === "string") {
                return null
            }
            return { userId: result.userId, userLogin: result.userLogin }
        } catch (err) {
            //console.log(err)
            return null
        }
    },

    async isTokenExpired(token: string) {
        try {
            const result = await jwt.verify(token, SETTINGS.JWT_SECRET)
            return false
        } catch (err) {
            return true
        }
    },

    async isTokenBlocked(token: string) {
        const result = await expiredTokensRepository.findExpiredToken(token)
        if (result === null) {
            return false
        }
        return true
    },

    async createExpiredToken(token: string) {

        const expiredToken: ExpiredTokensModel = {
            token: token,
            expiredAt: new Date(),
            status: 1
        }

        const result = await expiredTokensRepository.createExpiredToken(expiredToken)
        return result
    },


}
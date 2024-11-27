import { UserViewModel } from "../input-output-types/users-moduls";
import Jwt from "jsonwebtoken";
import { SETTINGS } from "../settings";
const jwt = Jwt;

export const jwtService = {

    async createJWT(user: UserViewModel) {
        const token = await jwt.sign({ userId: user.id, userLogin: user.login }, SETTINGS.JWT_SECRET, { expiresIn: '10m' })
        return {
            accessToken: token
        }
    },

    async getUserIdFromToken(token: string) {
        try {
            const result: any = await jwt.verify(token, SETTINGS.JWT_SECRET)
            return { userId: result.userId, userLogin: result.userLogin }
        } catch (err) {
            //console.log(err)
            return null
        }
    },


}
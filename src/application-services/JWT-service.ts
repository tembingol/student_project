import { UserViewModel } from "../input-output-types/users-moduls";
import Jwt from "jsonwebtoken";
import { SETTINGS } from "../settings";
const jwt = Jwt;

export const jwtService = {

    async createJWT(user: UserViewModel) {
        const token = await jwt.sign({ userId: user.id }, SETTINGS.JWT_SECRET, { expiresIn: '10m' })
        return {
            accessToken: token
        }
    },

    async getUserIdFromToken(token: string): Promise<string> {
        try {
            const result: any = await jwt.verify(token, SETTINGS.JWT_SECRET)
            return result.userId
        } catch (err) {
            //console.log(err)
            return ""
        }
    },


}
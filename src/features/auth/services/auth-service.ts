import { jwtService } from "../../../application-services/JWT-service"
import { LoginInputModel, UserViewModel } from "../../../input-output-types/users-moduls"
import { usersQueryService } from "../../users/services/users-query-service"
import { usersQueryRepository } from "../../users/users-query-repo"
import bcrypt from "bcrypt"

export const authService = {
    async checkUserCredintails(loginData: LoginInputModel) {
        let foundUser = await usersQueryRepository.getUserByLogin(loginData.loginOrEmail.trim())

        if (foundUser == null) {
            foundUser = await usersQueryRepository.getUserByEmail(loginData.loginOrEmail.trim())
        }

        if (foundUser === null) {
            return foundUser
        }

        const userCredentials = await usersQueryRepository.getUserCredentials(foundUser.id)

        if (userCredentials === null) {
            return userCredentials
        }

        const userHash = bcrypt.hashSync(loginData.password, userCredentials.salt)

        if (userHash !== userCredentials!.hash) {
            return null
        }

        return foundUser
    },

    async getUserByToken(userToken: string) {

        let userId = await jwtService.getUserIdFromToken(userToken)

        const foundUser = await usersQueryService.getUserById(userId)
        if (foundUser) {
            return userMapper(foundUser)
        }
        return foundUser
    }
}

function userMapper(user: UserViewModel) {
    return {
        email: user.email,
        login: user.login,
        userId: user.id,
    }
}
import { UUID } from "mongodb"
import { jwtService } from "../../../application-services/JWT-service"
import { ServicesResponse } from "../../../input-output-types/services-models"
import { LoginInputModel, UserInputModel, UserViewModel } from "../../../input-output-types/users-moduls"
import { emailManager } from "../../../managers/emailManager"
import { SETTINGS } from "../../../settings"
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

        let foundUserFronToken = await jwtService.getUserIdFromToken(userToken)

        if (!foundUserFronToken) {
            return null
        }
        const foundUser = await usersQueryService.getUserById(foundUserFronToken.userId)

        if (foundUser) {
            return userMapper(foundUser)
        }

        return foundUser
    },

    async registerNewUser(newUser: UserInputModel) {
        const response: ServicesResponse = {
            result: false,
            status: 400,
            data: {},
            errors: { errorsMessages: [] }
        }

        const isEmailAvalible = await usersQueryService.getUserByEmail(newUser.email)

        if (isEmailAvalible !== null) {
            response.result = false
            response.status = 400
            response.data = {}
            response.errors.errorsMessages.push({ message: "email should be unique", field: "email" })
            return response
        }

        const isLoginAvalible = await usersQueryRepository.getUserByLogin(newUser.login)

        if (isLoginAvalible !== null) {
            response.result = false
            response.status = 400
            response.data = {}
            response.errors.errorsMessages.push({ message: "login should be unique", field: "login" })
            return response
        }

        if (response.errors.errorsMessages.length > 0) {
            return response
        }

        const confirmationCode = (new UUID).toString()
        console.log(confirmationCode)
        const isEmailSended = await emailManager.sendRegistrationCode(["tembingol@vk.com"], confirmationCode)

        if (isEmailSended === false) {
            response.errors.errorsMessages.push({ message: "email sending error" })
        }

        response.result = true
        response.status = 200
        return response

    }
}

function userMapper(user: UserViewModel) {
    return {
        email: user.email,
        login: user.login,
        userId: user.id,
    }
}

import { jwtService } from "../../../application-services/JWT-service"
import { ServicesResponse } from "../../../input-output-types/services-models"
import { LoginInputModel, UserCredentialsModel, UserDataBaseModel, UserInputModel, UserViewModel } from "../../../input-output-types/users-moduls"
import { emailManager } from "../../../managers/emailManager"
import { usersQueryService } from "../../users/services/users-query-service"
import { usersQueryRepository } from "../../users/users-query-repo"
import bcrypt from "bcrypt"
import { add, format, compareAsc } from "date-fns";
import { v4 as uuidv4 } from 'uuid';
import { usersRepository } from "../../users/users-repository"
import { usersService } from "../../users/services/users-service"
import { HTTP_STATUS_CODE, ServicesResponseNew, TokenPlayLoadType, UserDeviceInfoType } from "../../../input-output-types/types"
import { sessionService } from "../../../application-services/sessions-service"
import { sessionsRepository } from "../../../application-services/sessions-repository"
import { SessionResponseMetadataModel } from "../../../input-output-types/sessions-models"


export const authService = {

    async checkUserCredintails(loginData: LoginInputModel) {
        let foundUser = await usersQueryService.getUserByLogin(loginData.loginOrEmail.trim())

        if (foundUser == null) {
            foundUser = await usersQueryService.getUserByEmail(loginData.loginOrEmail.trim())
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

        let foundUserFromToken = await jwtService.tokenVerify(userToken)

        if (foundUserFromToken === null) {
            return null
        }

        const foundUser = await usersQueryService.getUserByLogin(foundUserFromToken.userLogin)

        if (foundUser === null) {
            return null
        }

        return userMapper(foundUser)
    },

    async confirmEmail(reqBody: any) {
        const response: ServicesResponseNew<{}> = {
            result: false,
            status: 400,
            data: {},
            errors: { errorsMessages: [] }
        }

        if (!reqBody.code) {
            response.errors.errorsMessages.push({ message: "code should be string", field: "code" })
            return response
        }

        const DBUser = await usersService.getUserByConfirmationCode(reqBody.code)

        if (!DBUser.result) {
            return DBUser
        }

        const userData = DBUser.data as UserViewModel
        let userId = userData.id

        const confirmResult = await usersRepository.updateConfirmation(userId)

        if (confirmResult) {
            response.result = true
            response.status = 204
        }

        return response
    },

    async resendRegistrationEmail(reqBody: any) {
        const response: ServicesResponseNew<{}> = {
            result: false,
            status: 400,
            data: {},
            errors: { errorsMessages: [] }
        }

        if (!reqBody.email) {
            response.errors.errorsMessages.push({ message: "email should be string", field: "email" })
        } else if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(reqBody.email.trim()) == false) {
            response.errors.errorsMessages.push({ message: "not an email", field: "email" })
        }

        const foundUser = await usersQueryRepository.getUserByEmail(reqBody.email)

        if (foundUser === null) {
            response.result = false
            response.errors.errorsMessages.push({ message: "user with email not found", field: "email" })
            return response
        }

        if (foundUser.emailConfirmation.isConfirmed) {
            response.errors.errorsMessages.push({ message: "user already is confirmed", field: "email" })
            return response
        }

        if (foundUser.emailConfirmation.expirationDate < new Date()) {
            response.errors.errorsMessages.push({ message: "expirationDate", field: "email" })
            return response
        }

        const confirmationCode = uuidv4()

        const confirmResult = await usersRepository.updateConfirmationCode(foundUser._id.toString(), confirmationCode)

        if (!confirmResult) {
            return response
        }

        const isEmailSended = await emailManager.sendRegistrationConfirmation([reqBody.email], confirmationCode)

        if (isEmailSended === false) {
            response.errors.errorsMessages.push({ message: "email sending error", field: "email" })
        }

        response.result = true
        response.status = 204
        return response
    },

    async registerNewUser(user: UserInputModel) {

        const response: ServicesResponse = {
            result: false,
            status: 400,
            data: {},
            errors: { errorsMessages: [] }
        }

        const isEmailAvalible = await usersQueryService.getUserByEmail(user.email)

        if (isEmailAvalible !== null) {
            response.result = false
            response.status = 400
            response.data = {}
            response.errors.errorsMessages.push({ message: "email should be unique", field: "email" })
            return response
        }

        const isLoginAvalible = await usersQueryRepository.getUserByLogin(user.login)

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

        const confirmationCode = uuidv4()

        const newDBUser: UserDataBaseModel = {
            login: user.login,
            createdAt: new Date(),
            email: user.email,
            emailConfirmation: {
                confirmationCode: confirmationCode,
                expirationDate: add(new Date(), { hours: 1 }),
                isConfirmed: false
            },
            phoneConfirmation: {
                confirmationCode: confirmationCode,
                expirationDate: add(new Date(), { minutes: 1 }),
                isConfirmed: false
            },
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(user.password, salt)

        const usersCredentials: UserCredentialsModel = {
            userId: "",
            salt: salt,
            hash: hash
        }

        const isCreated = await usersRepository.createUser(newDBUser, usersCredentials)
        if (isCreated === "") {
            return response
        }

        const isEmailSended = await emailManager.sendRegistrationConfirmation([user.email], confirmationCode)

        if (isEmailSended === false) {
            response.errors.errorsMessages.push({ message: "email sending error" })
        }

        response.result = true
        response.status = 204
        return response
    },

    async logoutUser(token: string) {

        const response: ServicesResponseNew<{}> = {
            result: false,
            status: HTTP_STATUS_CODE.Unauthorized,
            data: {},
            errors: { errorsMessages: [] }
        }

        const playLoad = await jwtService.tokenVerify(token)

        const userSession = await sessionService.getCurrentSession(playLoad as TokenPlayLoadType)
        if (userSession === null) {
            return response
        }

        const isSessionDeleted = await sessionsRepository.deleteSession(userSession.id)

        if (!isSessionDeleted) {
            return response
        }

        response.result = true
        response.status = HTTP_STATUS_CODE.NoContent
        return response
    },

    async loginUser(foundUser: UserViewModel, userDeviceInfo: UserDeviceInfoType) {
        const response: ServicesResponseNew<SessionResponseMetadataModel> = {
            result: false,
            status: HTTP_STATUS_CODE.Unauthorized,
            data: {
                deviceId: '',
                accessToken: '',
                refreshToken: ''
            },
            errors: { errorsMessages: [] }
        }

        const deviceID = userDeviceInfo.deviceId
        const accessToken = await jwtService.createAccsessJWT(foundUser)
        const refreshToken = await jwtService.createRefreshJWT(foundUser, deviceID)

        const isSessionAdded = await sessionService.addSession(foundUser, refreshToken, userDeviceInfo)
        if (isSessionAdded === "") {
            return response
        }

        response.data = {
            deviceId: userDeviceInfo.deviceId,
            accessToken: accessToken,
            refreshToken: refreshToken
        }

        response.result = true
        response.status = HTTP_STATUS_CODE.NoContent

        return response
    },

    async refreshTokenVerify(refreshToken: string) {

        const playLoad = await jwtService.tokenVerify(refreshToken)

        if (!playLoad || playLoad.userId === undefined) {
            return false
        }

        const currentSession = await sessionService.getCurrentSession(playLoad as TokenPlayLoadType)

        if (!currentSession) {
            return false
        }

        return true

    },

    async refreshTokens(refreshToken: string, userDeviceInfo: UserDeviceInfoType) {

        const response: ServicesResponseNew<SessionResponseMetadataModel> = {
            result: false,
            status: HTTP_STATUS_CODE.Unauthorized,
            data: {
                deviceId: '',
                accessToken: '',
                refreshToken: ''
            },
            errors: { errorsMessages: [] }
        }

        const foundUser = await this.getUserByToken(refreshToken)

        if (foundUser === null) {
            return response
        }

        const playLoad = await jwtService.tokenVerify(refreshToken)

        const currentSession = await sessionService.getCurrentSession(playLoad as TokenPlayLoadType)

        if (currentSession === null) {
            return response
        }

        const foundBDUser = await usersQueryService.getUserById(foundUser.userId)

        if (foundBDUser === null) {
            return response
        }

        const deviceId = currentSession.device_id
        const newAccessToken = await jwtService.createAccsessJWT(foundBDUser)
        const newRefreshToken = await jwtService.createRefreshJWT(foundBDUser, deviceId)

        await sessionService.updateSession(currentSession.id, newRefreshToken)

        response.result = true
        response.data = {
            deviceId: deviceId,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }
        response.status = HTTP_STATUS_CODE.NoContent
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
import { UserInputModel, UserCredentialsModel, UserViewModel, UserDataBaseModel } from "../../../input-output-types/users-moduls"
import { usersRepository } from "../users-repository"
import { usersQueryRepository } from "../users-query-repo"
import bcrypt from "bcrypt"
import { userEntityMapper, usersQueryService } from "./users-query-service"
import { ServicesResponse } from "../../../input-output-types/services-models"
import { ObjectId } from "mongodb"


export const usersService = {

    createUser: async function (user: UserInputModel) {
        const response: ServicesResponse = {
            result: false,
            status: 400,
            data: {},
            errors: { errorsMessages: [] }
        }

        if (!user.login) {
            response.errors.errorsMessages.push({ message: "login should be string", field: "login" })
        } else if (user.login.trim().length < 3 || user.login.trim().length > 10) {
            response.errors.errorsMessages.push({ message: "login should be more then 3 or 10", field: "login" })
        } else if (/^[a-zA-Z0-9_-]*$/.test(user.login.trim()) == false) {
            response.errors.errorsMessages.push({ message: "login is not valid", field: "login" })
        }

        if (!user.password) {
            response.errors.errorsMessages.push({ message: "password should be string", field: "password" })
        } else if (user.password.trim().length < 6 || user.password.trim().length > 20) {
            response.errors.errorsMessages.push({ message: "password should be more then 6 or 20", field: "password" })
        }

        if (!user.email) {
            response.errors.errorsMessages.push({ message: "email should be string", field: "email" })
        } else if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email.trim()) == false) {
            response.errors.errorsMessages.push({ message: "not an email", field: "email" })
        }

        if (response.errors.errorsMessages.length > 0) {
            return response
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

        const newUser: UserDataBaseModel = {
            id: "",
            login: user.login,
            createdAt: new Date(),
            email: user.email,
            emailConfirmation: {
                confirmationCode: 'string',
                expirationDate: new Date(),
                isConfirmed: false
            },
            phoneConfirmation: {
                confirmationCode: 'string',
                expirationDate: new Date(),
                isConfirmed: false
            },
            _id: new ObjectId
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(user.password, salt)

        const usersCredentials: UserCredentialsModel = {
            userId: "",
            salt: salt,
            hash: hash
        }

        const isCreated = await usersRepository.createUser(newUser, usersCredentials)

        if (isCreated !== "") {
            const createdUser = await usersQueryRepository.getUserById(isCreated)
            response.result = true
            response.status = 201
            response.data = createdUser == null ? {} : userEntityMapper(createdUser)
        }

        return response
    },

    deleteUser: async function (useriD: string) {
        let response: ServicesResponse = {
            result: false,
            status: 404,
            data: {},
            errors: { errorsMessages: [] }
        }

        const isDeleted = await usersRepository.deleteUser(useriD)

        if (isDeleted) {
            response.result = true
            response.status = 204
            response.errors.errorsMessages = []
        }

        return response
    },

    getUserByConfirmationCode: async function (confirmCode: string) {
        let response: ServicesResponse = {
            result: false,
            status: 400,
            data: {},
            errors: { errorsMessages: [] }
        }
        const foundUser = await usersQueryRepository.getUserByConfirmationCode(confirmCode)

        if (foundUser === null) {
            response.errors.errorsMessages.push({ message: "confirmation code is wrong", field: "code" })
            return response
        }

        if (foundUser.emailConfirmation.expirationDate < new Date()) {
            response.errors.errorsMessages.push({ message: "confirmation code is exparied", field: "code" })
            return response
        }

        if (foundUser.emailConfirmation.isConfirmed) {
            response.errors.errorsMessages.push({ message: "user already is confirmed", field: "code" })
            return response
        }

        response.result = true
        response.status = 204
        response.data = { ...foundUser }
        return response
    }

}
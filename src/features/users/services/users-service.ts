import { HTTP_STATUS_CODE, ServicesResponseNew } from "../../../input-output-types/types"
import { UserCredentialsModel, UserDataBaseModel, UserInputModel, UserViewModel } from "../../../input-output-types/users-moduls"
import { UsersRepository } from "../repo/Users-repository"
import { UsersQueryRepository } from "../repo/UsersQuery-repository"
import { userEntityMapper, UsersQueryService } from "./usersQuery-service"
import bcrypt from "bcrypt"
import { injectable } from "inversify"

@injectable()
export class UsersService {

    constructor(
        protected usersQueryService: UsersQueryService,
        protected usersQueryRepository: UsersQueryRepository,
        protected usersRepository: UsersRepository
    ) { }

    async createUser(user: UserInputModel, isConfirmed: boolean = false) {
        const response: ServicesResponseNew<UserViewModel | {}> = {
            result: false,
            status: HTTP_STATUS_CODE.BadRequest,
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

        const isEmailAvalible = await this.usersQueryService.getUserByEmail(user.email)

        if (isEmailAvalible !== null) {
            response.errors.errorsMessages.push({ message: "email should be unique", field: "email" })
            return response
        }

        const isLoginAvalible = await this.usersQueryRepository.getUserByLogin(user.login)

        if (isLoginAvalible !== null) {
            response.errors.errorsMessages.push({ message: "login should be unique", field: "login" })
            return response
        }

        if (response.errors.errorsMessages.length > 0) {
            return response
        }

        const newUser: UserDataBaseModel = {
            login: user.login,
            createdAt: new Date(),
            email: user.email,
            emailConfirmation: {
                confirmationCode: 'string',
                expirationDate: new Date(),
                isConfirmed: isConfirmed
            },
            phoneConfirmation: {
                confirmationCode: 'string',
                expirationDate: new Date(),
                isConfirmed: false
            },
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(user.password, salt)

        const usersCredentials: UserCredentialsModel = {
            userId: "",
            salt: salt,
            hash: hash,
            passwordRecoveryCode: ""
        }

        const newUserId = await this.usersRepository.createUser(newUser, usersCredentials)

        const createdUser = await this.usersQueryRepository.getUserById(newUserId)

        if (createdUser !== null) {
            response.result = true
            response.status = 201
            response.data = userEntityMapper(createdUser)
        }

        return response
    }

    async deleteUser(useriD: string) {
        const response: ServicesResponseNew<UserViewModel | {}> = {
            result: false,
            status: HTTP_STATUS_CODE.NotFound,
            data: {},
            errors: { errorsMessages: [] }
        }

        const isDeleted = await this.usersRepository.deleteUser(useriD)

        if (isDeleted) {
            response.result = true
            response.status = HTTP_STATUS_CODE.NoContent
        }

        return response
    }

    async getUserByConfirmationCode(confirmCode: string) {
        const response: ServicesResponseNew<UserViewModel | {}> = {
            result: false,
            status: HTTP_STATUS_CODE.BadRequest,
            data: {},
            errors: { errorsMessages: [] }
        }
        const foundUser = await this.usersQueryRepository.getUserByConfirmationCode(confirmCode)

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
        response.status = HTTP_STATUS_CODE.NoContent
        response.data = userEntityMapper(foundUser)

        return response
    }
}
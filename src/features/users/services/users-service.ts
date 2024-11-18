import { UserInputModel, UserCredentialsModel, UserViewModel } from "../../../input-output-types/users-moduls"
import { usersRepository } from "../users-repository"
import { usersQueryRepository } from "../users-query-repo"
import bcrypt from "bcrypt"

export type userServiceResponse = {
    result: boolean,
    status: number,
    data: {},
    errors: { errorsMessages: {}[] }
}

export const usersService = {

    findUsers: async function (queryParams: any) {
        const pageNumber = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy = queryParams.sortBy ? queryParams.sortBy : "createdAt"
        const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc'
        const searchLoginTerm = queryParams.searchLoginTerm ? queryParams.searchLoginTerm : ""
        const searchEmailTerm = queryParams.searchEmailTerm ? queryParams.searchEmailTerm : ""

        const filter: any = {
            $or: [
                { login: { $regex: searchLoginTerm, $options: 'i' } },
                { email: { $regex: searchEmailTerm, $options: 'i' } }]
        }

        const allUsers = await usersQueryRepository.getAllUsers(
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            filter,
        )

        const totalCount = await usersQueryRepository.getDocumetnsCount(filter)

        const response: userServiceResponse = {
            result: true,
            status: 200,
            data: {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: allUsers,
            },
            errors: { errorsMessages: [] }
        }
        return response
    },

    createUser: async function (user: UserInputModel) {
        const response: userServiceResponse = {
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

        const isEmailAvalible = await usersQueryRepository.getUserByEmail(user.email)

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

        const newUser: UserViewModel = {
            id: "",
            login: user.login,
            createdAt: new Date(),
            email: user.email,
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
            response.data = createdUser == null ? {} : createdUser
        }

        return response
    },

    deleteUser: async function (useriD: string) {
        let response: userServiceResponse = {
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

}
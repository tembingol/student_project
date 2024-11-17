import { ObjectId } from "mongodb"
import { OutputErrorsType } from "../../../input-output-types/otput-errors-model"
import { UserInputModel, UserCredentialsModel, UserViewModel } from "../../../input-output-types/users-moduls"
import { usersRepository } from "../users-repository"
import { usersQueryRepository } from "../users-query-repo"
import bcrypt from "bcrypt"

export type userServiceResponse = {
    result: boolean,
    status: number,
    data: {},
    // errors: OutputErrorsType[] | string,
    errors: {}[] | string
}

export const usersService = {

    findUsers: async function (queryParams: any) {

        const pageNumber = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy = queryParams.sortBy ? queryParams.sortBy : "createdAt"
        const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc'
        const searchLoginTerm = queryParams.searchLoginTerm ? queryParams.searchLoginTerm : ""
        const searchEmailTerm = queryParams.searchEmailTerm ? queryParams.searchEmailTerm : ""

        const filter: any = {}
        // if (searchLoginTerm && searchEmailTerm) {
        //     filter.login = { $regex: searchLoginTerm, $options: 'i' }
        // }
        if (searchLoginTerm) {
            filter.login = { $regex: searchLoginTerm, $options: 'i' }
        }
        if (searchEmailTerm) {
            filter.email = { $regex: searchEmailTerm, $options: 'i' }
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
            errors: []
        }
        return response

    },

    createUser: async function (user: UserInputModel) {

        const response: userServiceResponse = {
            result: false,
            status: 400,
            data: {},
            errors: []
        }

        if (!user.login) {
            response.errors = [...response.errors, { errorsMessages: { message: "login should be string", field: "login" } }]
        } else if (user.login.trim().length < 3 || user.login.trim().length > 10) {
            response.errors = [...response.errors, { errorsMessages: { message: "login should be more then 3 or 10", field: "login" } }]
        } else if (/^[a-zA-Z0-9_-]*$/.test(user.login.trim()) == false) {
            response.errors = [...response.errors, { errorsMessages: { message: "login should true", field: "login" } }]
        }

        if (!user.password) {
            response.errors = [...response.errors, { errorsMessages: { message: "password should be string", field: "login" } }]
        } else if (user.password.trim().length < 6 || user.password.trim().length > 20) {
            response.errors = [...response.errors, { errorsMessages: { message: "password should be more then 6 or 20", field: "login" } }]
        }

        if (!user.email) {
            response.errors = [...response.errors, { errorsMessages: { message: "email should be string", field: "login" } }]
        } else if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email.trim()) == false) {
            response.errors = [...response.errors, { errorsMessages: { message: "email should true", field: "email" } }]
        }

        if (response.errors.length > 0) {
            return response
        }

        const isEmailAvalible = await usersQueryRepository.getUserByEmail(user.email)

        if (isEmailAvalible !== null) {
            response.result = false
            response.status = 400
            response.data = {}
            response.errors = [...response.errors, { errorsMessages: { message: "email should be unique", field: "email" } }]
            return response
        }

        const isLoginAvalible = await usersQueryRepository.getUserByLogin(user.login)

        if (isLoginAvalible !== null) {
            response.result = false
            response.status = 400
            response.data = {}
            response.errors = [...response.errors, { errorsMessages: { message: "login should be unique", field: "login" } }]
            return response
        }

        if (response.errors.length > 0) {
            return response
        }

        const userId = new ObjectId()
        const newUser: UserViewModel = {
            _id: userId,
            id: userId.toString(),
            login: user.login,
            createdAt: new Date(),
            email: user.email,
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(user.password, salt)

        const usersCredentials: UserCredentialsModel = {
            userId: userId.toString(),
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
            errors: "User not found"
        }

        const isDeleted = await usersRepository.deleteUser(useriD)

        if (isDeleted) {
            response.result = true
            response.status = 204
            response.errors = ""
        }

        return response

    },

}

import { ObjectId } from "mongodb"
import { OutputErrorsType } from "../../../input-output-types/otput-errors-model"
import { UserInputModel, UserViewModel } from "../../../input-output-types/users-moduls"
import { usersRepository } from "../users-repository"
import { usersQueryRepository } from "../users-query-repo"
import bcrypt from "bcrypt"

export type userServiceResponse = {
    result: boolean,
    status: number,
    data: {},
    errors: OutputErrorsType[] | string
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
            errors: [{ errorsMessages: { message: "error", field: "email" } }]
        }

        const isEmailAvalible = await usersQueryRepository.getUserByEmail(user.email)

        if (isEmailAvalible !== null) {
            response.result = false
            response.status = 400
            response.data = {}
            response.errors = [{ errorsMessages: { message: "email is busy", field: "email" } }]
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

        const isCreated = await usersRepository.createUser(newUser)

        if (isCreated) {
            response.result = true
            response.status = 204
            response.data = isCreated
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
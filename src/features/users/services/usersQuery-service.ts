import { HTTP_STATUS_CODE, PaginationResponseType, ServicesResponseNew } from "../../../input-output-types/types"
import { UserCredentialsModel, UserDataBaseModel, UserViewModel } from "../../../input-output-types/users-moduls"
import { UsersQueryRepository } from "../repo/UsersQuery-repository"

export class UsersQueryService {

    constructor(
        protected usersQueryRepository: UsersQueryRepository
    ) { }

    async getUserById(id: string) {
        const foundUser = await this.usersQueryRepository.getUserById(id)
        if (foundUser === null) {
            return foundUser
        }
        return userEntityMapper(foundUser)

    }

    async getUserCredentials(userId: string) {
        const filter = { userId: userId }
        const foundUser = await this.usersQueryRepository.getUserCredentials(userId)
        if (foundUser) {
            return userCredentialsMapper(foundUser)
        }
        return foundUser
    }

    async findUsers(queryParams: any) {
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

        const allUsers = await this.usersQueryRepository.getAllUsers(
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            filter,
        )

        const mappedAllUsers = allUsers.map((el) => userEntityMapper(el))

        const totalCount = await this.usersQueryRepository.getDocumetnsCount(filter)

        const result: ServicesResponseNew<PaginationResponseType<UserViewModel>> = {
            result: true,
            status: 200,
            data: {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: mappedAllUsers,
            },
            errors: { errorsMessages: [] }
        }
        return result
    }

    async getUserByEmail(email: string) {
        const foundUser = await this.usersQueryRepository.getUserByEmail(email)
        if (foundUser) {
            return userEntityMapper(foundUser)
        }
        return foundUser
    }

    async getUserByEmailServicesResponse(email: string) {
        const response: ServicesResponseNew<UserViewModel | {}> = {
            result: false,
            status: HTTP_STATUS_CODE.BadRequest,
            data: {},
            errors: { errorsMessages: [] }
        }

        const foundUser = await this.usersQueryRepository.getUserByEmail(email)

        if (foundUser === null) {
            return response
        }

        response.result = true
        response.status = HTTP_STATUS_CODE.OK
        response.data = userEntityMapper(foundUser)

        return response
    }

    async getUserByLogin(login: string) {
        const foundUser = await this.usersQueryRepository.getUserByLogin(login)
        if (foundUser) {
            return userEntityMapper(foundUser)
        }
        return foundUser
    }
}

export function userEntityMapper(user: UserDataBaseModel): UserViewModel {
    return {
        id: user._id!.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    }
}

export function userCredentialsMapper(userCredential: UserCredentialsModel): UserCredentialsModel {
    return {
        userId: userCredential.userId,
        salt: userCredential.salt,
        hash: userCredential.hash,
    }
}
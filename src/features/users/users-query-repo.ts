import { usersCollection, usersCredentialsCollection } from "../../db/mongodb"
import { UserCredentialsModel, UserDataBaseModel, UserViewModel } from "../../input-output-types/users-moduls"

export const usersQueryRepository = {

    getUserCredentials: async function (userId: string) {
        const filter = { userId: userId }
        const foundUser = await usersCredentialsCollection.findOne(filter)
        if (foundUser) {
            return userCredentialsMapper(foundUser)
        }
        return foundUser
    },

    getUserByLogin: async function (login: string) {
        const filter = { login: login }
        const foundUser = await usersCollection.findOne(filter)
        if (foundUser) {
            return userEntityMapper(foundUser)
        }
        return foundUser
    },

    getUserByEmail: async function (email: string) {
        const filter = { email: email }
        const foundUser = await usersCollection.findOne(filter)
        if (foundUser) {
            return userEntityMapper(foundUser)
        }
        return foundUser
    },

    getUserById: async function (id: string) {
        const filter = { id: id }
        const foundUser = await usersCollection.findOne(filter)
        if (foundUser) {
            return userEntityMapper(foundUser)
        }
        return foundUser
    },

    getAllUsers: async function (pageNumber: Number, pageSize: Number, sortBy: string, sortDirection: string, filter: {},) {

        const _pageNumber = +pageNumber
        const _pageSize = +pageSize
        const _sortDirection = sortDirection === 'asc' ? 1 : -1

        const allUsers = await usersCollection.find(filter)
            .skip((_pageNumber - 1) * _pageSize)
            .limit(_pageSize)
            .sort({ [sortBy]: _sortDirection })
            .toArray()

        return allUsers.map((el) => userEntityMapper(el))
    },

    getDocumetnsCount: async function (filter: {}) {
        return await usersCollection.countDocuments(filter)
    }
}

function userEntityMapper(user: UserDataBaseModel): UserViewModel {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    }
}

function userCredentialsMapper(userCredential: UserCredentialsModel): UserCredentialsModel {
    return {
        userId: userCredential.userId,
        salt: userCredential.salt,
        hash: userCredential.hash,
    }
}
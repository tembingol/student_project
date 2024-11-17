import { usersCollection } from "../../db/mongodb"
import { UserViewModel } from "../../input-output-types/users-moduls"

export const usersQueryRepository = {

    getUserByLogin: async function (loginOrEmail: string) {
        const filter = { loginOrEmail: loginOrEmail }
        const foundUser = await usersCollection.findOne(filter)
        if (foundUser) {
            userEntityMapper(foundUser)
        }
        return foundUser
    },

    getUserByEmail: async function (email: string) {
        const filter = { email: email }
        const foundUser = await usersCollection.findOne(filter)
        if (foundUser) {
            userEntityMapper(foundUser)
        }
        return foundUser
    },

    getAllUsers: async function (pageNumber: Number, pageSize: Number, sortBy: string, sortDirection: string, filter: {},) {

        const _pageNumber = +pageNumber
        const _pageSize = +pageSize
        const _sortDirection = sortDirection === 'asc' ? 1 : -1

        // console.log("getAllBlogs_sortDirection  %s", _sortDirection)
        // console.log("getAllBlogs_filter  %s", filter)
        // console.log(filter)
        // console.log("getAllBlogs_sortBy  %s", sortBy)

        const allUsers = await usersCollection.find(filter)
            .skip((_pageNumber - 1) * _pageSize)
            .limit(_pageSize)
            .sort({ [sortBy]: _sortDirection })
            .toArray()

        return allUsers.map((el) => userEntityMapper(el))
    },

    getDocumetnsCount: async function (filter: {}) {

        // console.log('getDocumetnsCount Logger \n{--')
        // console.log('filter %s', filter)
        // console.log(filter)
        // console.log('--}')

        return await usersCollection.countDocuments(filter)
    }

}

function userEntityMapper(user: UserViewModel) {

    return {
        id: user.id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    }

    // const mappedArr = arrToMAp.map((el) => {
    //     let { ["_id"]: _, ...mapped } = el
    //     return mapped
    // })
    // return mappedArr
}
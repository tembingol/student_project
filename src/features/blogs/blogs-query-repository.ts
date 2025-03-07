import { db } from "../../db/db"

export const blogsQueryRepository = {

    getAllBlogs: async function (pageNumber: Number, pageSize: Number, sortBy: string, sortDirection: string, filter: {},) {
        const _pageNumber = +pageNumber
        const _pageSize = +pageSize
        const _sortDirection = sortDirection === 'asc' ? 1 : -1

        const allBlogs = await db.getCollections().blogCollection.find(filter)
            .skip((_pageNumber - 1) * _pageSize)
            .limit(_pageSize)
            .sort({ [sortBy]: _sortDirection })
            .toArray()

        return allBlogs
    },

    getBlogByID: async function (filter: {}) {
        const foundUser = await db.getCollections().blogCollection.findOne(filter)
        return foundUser
    },

    getDocumetnsCount: async function (filter: {}) {
        const retult = await db.getCollections().blogCollection.countDocuments(filter)
        return retult
    },

}
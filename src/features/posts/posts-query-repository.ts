import { db } from "../../db/db"

export const postsQueryRepository = {

    getAllPosts: async function (pageNumber: Number, pageSize: Number, sortBy: string, sortDirection: string, filter: {},) {
        const _pageNumber = +pageNumber
        const _pageSize = +pageSize
        const _sortDirection = sortDirection === 'asc' ? 1 : -1

        const allPosts = await db.getCollections().postCollection.find(filter)
            .skip((_pageNumber - 1) * _pageSize)
            .limit(_pageSize)
            .sort({ createdAt: _sortDirection, [sortBy]: _sortDirection })
            .toArray()

        return allPosts
    },

    getPostByID: async function (filter: {}) {
        const foundUser = await db.getCollections().postCollection.findOne(filter)
        return foundUser
    },

    getDocumetnsCount: async function (filter: {}) {
        return await db.getCollections().postCollection.countDocuments(filter)
    },
}
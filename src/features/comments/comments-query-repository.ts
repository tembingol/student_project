import { ObjectId } from "mongodb"
import { db } from "../../db/db"
import { commentEntityMapper } from "./services/comments-query-service"

export const commentsQueryRepository = {

    getCommentByID: async function (id: string) {
        const filter = { _id: new ObjectId(id) }
        const retult = await db.getCollections().commentsCollection.findOne(filter)
        return retult
    },

    getCommentByFilter: async function (filter: {}) {
        const retult = await db.getCollections().commentsCollection.findOne(filter)
        return retult
    },

    getCommentsOfPost: async function (postId: string, pageNumber: Number, pageSize: Number, sortBy: string, sortDirection: string, searchNameTerm: string,) {
        const _pageNumber = +pageNumber
        const _pageSize = +pageSize
        const _sortDirection = sortDirection === 'asc' ? 1 : -1

        const allPosts = await db.getCollections().commentsCollection.find({ "postId": postId })
            .skip((_pageNumber - 1) * _pageSize)
            .limit(_pageSize)
            .sort({ createdAt: _sortDirection, [sortBy]: _sortDirection })
            .toArray()

        const mappedPosts = allPosts.map((el) => commentEntityMapper(el))

        return mappedPosts
    },

    getDocumetnsCountOfPost: async function (filter: {}) {
        const retult = await db.getCollections().commentsCollection.countDocuments(filter)
        return retult
    },
}

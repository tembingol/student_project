import { BlogModel } from "../../input-output-types/blogs-models"

export const blogsQueryRepository = {

    getAllBlogs: async function (pageNumber: Number, pageSize: Number, sortBy: string, sortDirection: string, filter: {},) {
        const _pageNumber = +pageNumber
        const _pageSize = +pageSize
        const _sortDirection = sortDirection === 'asc' ? 1 : -1

        const allBlogs = await BlogModel.find(filter)
            .skip((_pageNumber - 1) * _pageSize)
            .limit(_pageSize)
            .sort({ [sortBy]: _sortDirection })
            .lean()

        return allBlogs
    },

    getBlogByID: async function (id: string) {
        const foundUser = await BlogModel.findOne({ _id: id })
        return foundUser
    },

    getDocumetnsCount: async function (filter: {}) {
        const retult = await BlogModel.countDocuments(filter)
        return retult
    },

}
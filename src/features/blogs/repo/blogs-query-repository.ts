import { injectable } from "inversify"
import { BlogModel } from "../../../input-output-types/blogs-models"

@injectable()
export class BlogsQueryRepository {

    async getAllBlogs(pageNumber: Number, pageSize: Number, sortBy: string, sortDirection: string, filter: {},) {
        const _pageNumber = +pageNumber
        const _pageSize = +pageSize
        const _sortDirection = sortDirection === 'asc' ? 1 : -1

        const allBlogs = await BlogModel.find(filter)
            .skip((_pageNumber - 1) * _pageSize)
            .limit(_pageSize)
            .sort({ [sortBy]: _sortDirection })
            .lean()

        return allBlogs
    }

    async getBlogByID(id: string) {
        const foundUser = await BlogModel.findOne({ _id: id })
        return foundUser
    }

    async getDocumetnsCount(filter: {}) {
        const retult = await BlogModel.countDocuments(filter)
        return retult
    }

}
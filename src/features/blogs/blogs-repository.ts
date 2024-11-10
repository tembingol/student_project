import { ObjectId } from "mongodb"
import { blogCollection } from "../../db/mongodb"
import { BlogInputModel, BlogViewModel } from "../../input-output-types/blogs-models"

export const blogsRepository = {

    getAllBlogs: async function (pageNumber: Number, pageSize: Number, sortBy: string, sortDirection: string, searchNameTerm: string,) {
        const filter: any = {}
        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' }
        }
        const _pageNumber = +pageNumber
        const _pageSize = +pageSize
        const _sortDirection = sortDirection === 'asc' ? 1 : -1

        console.log("getAllBlogs_sortDirection  %s", _sortDirection)
        console.log("getAllBlogs_filter  %s", filter)
        console.log(filter)
        console.log("getAllBlogs_sortBy  %s", sortBy)

        const allBlogs = await blogCollection.find(filter)
            .skip((_pageNumber - 1) * _pageSize)
            .limit(_pageSize)
            .sort({ [sortBy]: _sortDirection })
            .toArray()

        return allBlogs
    },

    getBlogByID: async function (id: string) {
        const foundBlog = await blogCollection.findOne({ id: id })
        return foundBlog
    },

    createBlog: async function (blogBody: BlogInputModel) {
        const newBlogObjectId = new ObjectId()
        const newBlog: BlogViewModel = {
            "_id": newBlogObjectId,
            "id": newBlogObjectId.toString(),
            "name": blogBody.name,
            "description": blogBody.description,
            "websiteUrl": blogBody.websiteUrl,
            "createdAt": new Date().toISOString(),
            "isMembership": false,
        }
        const insertResult = await blogCollection.insertOne(newBlog)
        return insertResult.insertedId.toString()
    },

    updateBlog: async function (id: string, blogBody: BlogInputModel) {
        const result = await blogCollection.updateOne({ id: id }, {
            $set: {
                name: blogBody.name,
                description: blogBody.description,
                websiteUrl: blogBody.websiteUrl
            }
        })

        return result.matchedCount === 1
    },

    deleteBlog: async function (id: string) {
        const result = await blogCollection.deleteOne({ id: id })
        return result.deletedCount === 1
    },

    getDocumetnsCount: async function (searchNameTerm: string) {
        const filter: any = {}
        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' }
        }

        console.log('getDocumetnsCount Logger \n{--')
        console.log('filter %s', filter)
        console.log(filter)
        console.log('--}')

        return await blogCollection.countDocuments(filter)
    }
}
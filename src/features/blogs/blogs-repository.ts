import { ObjectId } from "mongodb"
import { blogCollection } from "../../db/mongodb"
import { BlogInputModel, BlogViewModel } from "../../input-output-types/blogs-models"

export const blogsRepository = {

    getAllBlogs: async function (pageNumber: Number, pageSize: Number, sortBy: string, sortDirection: string, searchNameTerm: string,) {

        const filter: any = {}
        if (searchNameTerm) {
            filter.title = { $regex: searchNameTerm, $option: 'i' }
        }
        const _pageNumber = +pageNumber
        const _pageSize = +pageSize
        const _sortDirection = sortDirection === 'asc' ? 1 : -1

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
            filter.title = { $regex: searchNameTerm, $option: 'i' }
        }
        return await blogCollection.countDocuments(filter)
    }
}
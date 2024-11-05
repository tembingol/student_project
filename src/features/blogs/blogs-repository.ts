import { ObjectId } from "mongodb"
import { blogCollection } from "../../db/mongodb"
import { BlogInputModel, BlogViewModel } from "../../input-output-types/blogs-models"

export const blogsRepository = {
    getAllBlogs: async function () {
        const allBlogs = await blogCollection.find({}).toArray()
        return allBlogs.map((el) => {
            let { ["_id"]: _, ...mapped } = el
            return mapped
        })
    },
    getBlogByID: async function (id: string) {
        const foundBlog = await blogCollection.findOne({ id: id })
        if (foundBlog == null) {
            return false
        }
        let { ["_id"]: _, ...mapedBlog } = foundBlog
        return mapedBlog
    },
    createBlog: async function (reqBody: BlogInputModel) {
        const result = {
            result: false,
            id: ""
        }

        const newBlogObjectId = new ObjectId()
        const newBlog: BlogViewModel = {
            "_id": newBlogObjectId,
            "id": newBlogObjectId.toString(),
            "name": reqBody.name,
            "description": reqBody.description,
            "websiteUrl": reqBody.websiteUrl,
            "createdAt": new Date().toISOString(),
            "isMembership": false,
        }
        try {
            const insertResult = await blogCollection.insertOne(newBlog)
            result.result = true
            result.id = insertResult.insertedId.toString()
        } catch (err) {
            console.error(err)
        }
        return result
    },
    updateBlog: async function (id: string, reqBody: BlogViewModel) {
        try {
            const result = await blogCollection.updateOne({ id: id }, {
                $set: {
                    name: reqBody.name,
                    description: reqBody.description,
                    websiteUrl: reqBody.websiteUrl
                }
            })

            if (result.modifiedCount > 0) {
                return true
            }

        } catch (err) {
            console.error(err)
        }
        return false
    },
    deleteBlog: async function (id: string) {
        try {
            const result = await blogCollection.deleteOne({ id: id })

            if (result.deletedCount > 0) {
                return true
            }
        } catch (err) {
            console.error(err)
        }
        return false
    }
}
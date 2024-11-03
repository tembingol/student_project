import { ObjectId } from "mongodb"
import { blogCollection } from "../../db/mongodb"
import { BlogInputModel, BlogViewModel } from "../../input-output-types/blogs-models"

export const blogsRepository = {
    getAllBlogs: async function () {
        const allBlogs = await blogCollection.find({})
        return allBlogs.toArray()
    },
    getBlogByID: async function (id: string) {
        const foundBlog = await blogCollection.findOne({ _id: new ObjectId(id) })
        if (!foundBlog?._id) {
            return false
        }
        return foundBlog
    },
    createBlog: async function (reqBody: BlogInputModel) {
        const newBlog: BlogViewModel = {
            "id": new Date().toISOString(),
            "name": reqBody.name,
            "description": reqBody.description,
            "websiteUrl": reqBody.websiteUrl,
            "createdAt": new Date().toISOString(),
            "isMembership": false,
        }
        try {
            const result = await blogCollection.insertOne(newBlog)
            //if (!result) {
            return result.insertedId.toString()
            //}
        } catch (err) {
            console.error(err)
        }
        return false
    },
    updateBlog: async function (id: string, reqBody: BlogViewModel) {
        try {
            const result = await blogCollection.updateOne({ _id: new ObjectId(id) }, { $set: { name: reqBody.name, description: reqBody.description, websiteUrl: reqBody.websiteUrl } })

            if (result.upsertedCount > 0) {
                return true
            }

        } catch (err) {
            console.error(err)
        }
        return false
    },
    deleteBlog: async function (id: string) {
        try {
            const result = await blogCollection.deleteOne({ _id: new ObjectId(id) })

            if (result.deletedCount > 0) {
                return true
            }
        } catch (err) {
            console.error(err)
        }
        return false
    }
}
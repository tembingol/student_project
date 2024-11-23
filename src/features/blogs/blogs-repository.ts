import { ObjectId } from "mongodb"
import { blogCollection } from "../../db/mongodb"
import { BlogDataBaseModel, BlogInputModel, BlogViewModel } from "../../input-output-types/blogs-models"

export const blogsRepository = {

    createBlog: async function (blog: BlogViewModel) {

        const newObjectId = new ObjectId()
        const newBlog: BlogDataBaseModel = {
            ...blog,
            _id: newObjectId,
            id: newObjectId.toString(),
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


}
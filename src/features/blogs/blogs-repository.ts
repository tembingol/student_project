import { BlogInputModel, BlogModel } from "../../input-output-types/blogs-models"

export const blogsRepository = {

    createBlog: async function (blog: BlogInputModel) {
        const newBlog = new BlogModel(blog)

        await newBlog.save()

        return newBlog.toObject()
    },

    updateBlog: async function (id: string, blogBody: BlogInputModel) {
        const foundBlog = await BlogModel.findOne({ _id: id })
        if (!foundBlog) {
            return false
        }
        foundBlog.name = blogBody.name
        foundBlog.description = blogBody.description
        foundBlog.websiteUrl = blogBody.websiteUrl
        await foundBlog.save()

        return true
    },

    deleteBlog: async function (id: string) {
        const foundBlog = await BlogModel.findOne({ _id: id })
        if (!foundBlog) {
            return false
        }
        await foundBlog.deleteOne()
        return true
    },

}
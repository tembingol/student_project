import { injectable } from "inversify"
import { BlogInputModel, BlogModel } from "../../../input-output-types/blogs-models"

@injectable()
export class BlogsRepository {

    async createBlog(blog: BlogInputModel) {
        const newBlog = new BlogModel(blog)

        await newBlog.save()

        return newBlog.toObject()
    }

    async updateBlog(id: string, blogBody: BlogInputModel) {
        const foundBlog = await BlogModel.findOne({ _id: id })
        if (!foundBlog) {
            return false
        }
        foundBlog.name = blogBody.name
        foundBlog.description = blogBody.description
        foundBlog.websiteUrl = blogBody.websiteUrl
        await foundBlog.save()

        return true
    }

    async deleteBlog(id: string) {
        const foundBlog = await BlogModel.findOne({ _id: id })
        if (!foundBlog) {
            return false
        }
        await foundBlog.deleteOne()
        return true
    }

}
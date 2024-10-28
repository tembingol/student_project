import { db } from "../../db/db"
import { BlogInputModel, BlogViewModel } from "../../input-output-types/blogs-models"

export const blogsRepository = {
    getAllBlogs: function () {
        const allBlogs = db.blogs
        return allBlogs
    },
    getBlogByID: function (id: string) {
        const index = db.blogs.findIndex((e) => e.id === id)
        if (index === -1) {
            return false
        }
        return db.blogs[index]
    },
    createBlog: function (reqBody: BlogInputModel) {
        const newBlog: BlogViewModel = {
            "id": (db.blogs.length + 1).toString(),
            "name": reqBody.name,
            "description": reqBody.description,
            "websiteUrl": reqBody.websiteUrl,
        }
        try {
            db.blogs.push(newBlog)
            return newBlog.id
        } catch (err) {
            return false
        }

    },
    updateBlog: function (id: string, reqBody: BlogViewModel) {
        const index = db.blogs.findIndex((e) => e.id === id);

        if (index === -1) {
            return false
        }

        db.blogs[index].name = reqBody.name;
        db.blogs[index].description = reqBody.description;
        db.blogs[index].websiteUrl = reqBody.websiteUrl;

        return true
    },
    deleteBlog: function (id: string) {
        const index = db.blogs.findIndex((e) => e.id === id);

        if (index === -1) {
            return false
        }

        db.blogs.splice(index, 1)
        return true
    }
}
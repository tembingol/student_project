import { db } from "../../db/db"
import { PostInputModel, PostViewModel } from "../../input-output-types/posts-models"

export const postsRepository = {
    getAllPosts: function () {
        const allBlogs = db.posts
        return allBlogs
    },
    getPostByID: function (id: string) {
        const index = db.posts.findIndex((e) => e.id === id)
        if (index === -1) {
            return false
        }
        return db.posts[index]
    },
    createPost: function (reqBody: PostInputModel) {
        const newPost: PostViewModel = {
            "id": (db.posts.length + 1).toString(),
            "title": reqBody.title,
            "shortDescription": reqBody.shortDescription,
            "content": reqBody.content,
            "blogId": reqBody.blogId,
            blogName: ""
        }
        try {
            db.posts.push(newPost)
            return newPost.id
        } catch (err) {
            return false
        }
    },
    updatePost: function (id: string, reqBody: PostViewModel) {
        const index = db.posts.findIndex((e) => e.id === id);

        if (index === -1) {
            return false
        }

        db.posts[index].title = reqBody.title;
        db.posts[index].shortDescription = reqBody.shortDescription;
        db.posts[index].content = reqBody.content;
        db.posts[index].blogId = reqBody.blogId;

        return true
    },
    deletePost: function (id: string) {
        const index = db.posts.findIndex((e) => e.id === id);

        if (index === -1) {
            return false
        }

        db.posts.splice(index, 1)
        return true
    }
}
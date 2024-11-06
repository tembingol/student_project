import { ObjectId } from "mongodb"
import { postCollection } from "../../db/mongodb"
import { PostInputModel, PostViewModel } from "../../input-output-types/posts-models"

export const postsRepository = {
    getAllPosts: async function () {
        const allPosts = await postCollection.find().toArray()
        return allPosts.map((el) => {
            let { ["_id"]: _, ...mapped } = el
            return mapped
        })
    },

    getAllPostsOfBlog: async function (blogId: string) {
        const allPosts = await postCollection.find({ "blogId": blogId }).toArray()
        return allPosts.map((el) => {
            let { ["_id"]: _, ...mapped } = el
            return mapped
        })
    },

    getPostByID: async function (id: string) {
        const foundPost = await postCollection.findOne({ id: id })
        if (!foundPost) {
            return false
        }
        let { ["_id"]: _, ...mapedPost } = foundPost
        return mapedPost
    },
    createPost: async function (reqBody: PostInputModel) {

        const newPostObjectId = new ObjectId()
        const newPost: PostViewModel = {
            "_id": newPostObjectId,
            "id": newPostObjectId.toString(),
            "title": reqBody.title,
            "shortDescription": reqBody.shortDescription,
            "content": reqBody.content,
            "blogId": reqBody.blogId,
            "blogName": "",
            "createdAt": new Date().toISOString(),
        }
        const insertResult = await postCollection.insertOne(newPost)
        return insertResult.insertedId.toString()
    },

    updatePost: async function (id: string, reqBody: PostViewModel) {
        try {
            const result = await postCollection.updateOne({ id: id }, {
                $set: {
                    title: reqBody.title,
                    shortDescription: reqBody.shortDescription,
                    content: reqBody.content,
                    blogId: reqBody.blogId,
                    blogName: !reqBody.blogName ? "" : reqBody.blogName

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
    deletePost: async function (id: string) {
        try {
            const result = await postCollection.deleteOne({ id: id })

            if (result.deletedCount > 0) {
                return true
            }
        } catch (err) {
            console.error(err)
        }
        return false
    }
}
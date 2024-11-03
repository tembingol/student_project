import { ObjectId } from "mongodb"
import { postCollection } from "../../db/mongodb"
import { PostInputModel, PostViewModel } from "../../input-output-types/posts-models"

export const postsRepository = {
    getAllPosts: async function () {
        const allPosts = await postCollection.find().toArray()
        return allPosts
    },
    getPostByID: async function (id: string) {
        const foundPost = await postCollection.findOne({ _id: new ObjectId(id) })
        if (!foundPost) {
            return false
        }
        return foundPost.id
    },
    createPost: async function (reqBody: PostInputModel) {
        const newPost: PostViewModel = {
            "id": new Date().toISOString(),
            "title": reqBody.title,
            "shortDescription": reqBody.shortDescription,
            "content": reqBody.content,
            "blogId": reqBody.blogId,
            "blogName": "",
            "createdAt": new Date().toISOString(),
        }
        try {
            const result = await postCollection.insertOne(newPost)
            //if (!result.insertedId) {
            return result.insertedId.toString()
            //}
        } catch (err) {
            console.error(err)
        }
        return false
    },
    updatePost: async function (id: string, reqBody: PostViewModel) {
        try {
            const result = await postCollection.updateOne({ _id: new ObjectId(id) }, {
                $set: {
                    title: reqBody.title,
                    shortDescription: reqBody.shortDescription,
                    content: reqBody.content,
                    blogId: reqBody.blogId,
                    blogName: !reqBody.blogName ? "" : reqBody.blogName

                }
            })

            if (result.upsertedCount > 0) {
                return true
            }

        } catch (err) {
            console.error(err)
        }
        return false
    },
    deletePost: async function (id: string) {
        try {
            const result = await postCollection.deleteOne({ _id: new ObjectId(id) })

            if (result.deletedCount > 0) {
                return true
            }
        } catch (err) {
            console.error(err)
        }
        return false
    }
}
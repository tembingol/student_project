import { ObjectId } from "mongodb"
import { db } from "../../db/db"
import { PostDataBaseModel, PostInputModel, PostViewModel } from "../../input-output-types/posts-models"

export const postsRepository = {

    createPost: async function (post: PostViewModel) {
        const newObjectId = new ObjectId()
        const newPost: PostDataBaseModel = {
            ...post,
            _id: newObjectId,
            id: newObjectId.toString(),
        }

        const insertResult = await db.getCollections().postCollection.insertOne(newPost)
        return insertResult.insertedId.toString()
    },

    updatePost: async function (id: string, postBody: PostInputModel) {
        const result = await db.getCollections().postCollection.updateOne({ id: id }, {
            $set: {
                title: postBody.title,
                shortDescription: postBody.shortDescription,
                content: postBody.content,
                blogId: postBody.blogId,
                blogName: postBody.blogName ? postBody.blogName : ""
            }
        })

        return result.matchedCount === 1
    },

    deletePost: async function (id: string) {
        const result = await db.getCollections().postCollection.deleteOne({ id: id })
        return result.deletedCount === 1
    },

}
import { ObjectId } from "mongodb"
import { injectable } from "inversify"
import { PostDataBaseModel, PostInputModel, PostViewModel } from "../../../input-output-types/posts-models"
import { db } from "../../../db/db"

@injectable()
export class PostsRepository {

    async createPost(post: PostViewModel) {
        const newObjectId = new ObjectId()
        const newPost: PostDataBaseModel = {
            ...post,
            _id: newObjectId,
            id: newObjectId.toString(),
        }

        const insertResult = await db.getCollections().postCollection.insertOne(newPost)
        return insertResult.insertedId.toString()
    }

    async updatePost(id: string, postBody: PostInputModel) {
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
    }

    async deletePost(id: string) {
        const result = await db.getCollections().postCollection.deleteOne({ id: id })
        return result.deletedCount === 1
    }

}
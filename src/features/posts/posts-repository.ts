import { ObjectId } from "mongodb"
import { postCollection } from "../../db/mongodb"
import { PostInputModel, PostViewModel } from "../../input-output-types/posts-models"

export const postsRepository = {
    getAllPosts: async function (pageNumber: Number, pageSize: Number, sortBy: string, sortDirection: string, searchNameTerm: string,) {

        const filter: any = {}
        if (searchNameTerm) {
            filter.title = { $regex: searchNameTerm, $option: 'i' }
        }
        const _pageNumber = +pageNumber
        const _pageSize = +pageSize
        const _sortDirection = sortDirection === 'asc' ? 1 : -1

        const allPosts = await postCollection.find(filter)
            .skip((_pageNumber - 1) * _pageSize)
            .limit(_pageSize)
            .sort({ [sortBy]: _sortDirection })
            .toArray()

        return allPosts

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
        return foundPost
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

    updatePost: async function (id: string, postBody: PostInputModel) {
        const result = await postCollection.updateOne({ id: id }, {
            $set: {
                title: postBody.title,
                shortDescription: postBody.shortDescription,
                content: postBody.content,
                blogId: postBody.blogId,
                blogName: !postBody.blogName ? "" : postBody.blogName

            }
        })

        return result.matchedCount === 1
    },

    deletePost: async function (id: string) {

        const result = await postCollection.deleteOne({ id: id })
        return result.deletedCount === 1

    },

    getDocumetnsCount: async function (searchNameTerm: string) {
        const filter: any = {}
        if (searchNameTerm) {
            filter.title = { $regex: searchNameTerm, $option: 'i' }
        }
        return await postCollection.countDocuments(filter)
    }
}
import { postCollection } from "../../../db/mongodb"
import { PostInputModel } from "../../../input-output-types/posts-models"
import { postsRepository } from "../posts-repository"

export const postsService = {

    findPosts: async function (queryParams: any) {

        console.log("queryParams")
        console.log(queryParams)

        const pageNumber = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy = !queryParams.sortBy ? queryParams.sortBy : "createdAt"
        const sortDirection = !queryParams.sortDirection ? queryParams.sortDirection : 'asc'
        const searchNameTerm = !queryParams.searchNameTerm ? queryParams.searchNameTerm : ""

        const allBlogs = await postsRepository.getAllPosts(
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm
        )

        allBlogs.map((el) => {
            let { ["_id"]: _, ...mapped } = el
            return mapped
        })
        const totalCount = await postsRepository.getDocumetnsCount(searchNameTerm)

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount,
            items: allBlogs,
        }
    },
    findPostById: async function (id: string) {
        const foundBlog = await postCollection.findOne({ id: id })
        return foundBlog
    },

    findPostsOfBlog: async function (blogId: string) {
        return await postsRepository.getAllPostsOfBlog(blogId)
    },

    createPost: async function (postBody: PostInputModel) {
        const newPostId = await postsRepository.createPost(postBody);

        const foundBlog = await postsRepository.getPostByID(newPostId);
        return foundBlog
    },

    updatePost: async function (id: string, postBody: PostInputModel) {
        const isBlogUpdated = await postsRepository.updatePost(id, postBody);
        return isBlogUpdated
    },

    deletePost: async function (id: string) {
        const isBlogDeleted = await postsRepository.deletePost(id)
        return isBlogDeleted
    },

}
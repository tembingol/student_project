import { postCollection } from "../../../db/mongodb"
import { PostInputModel } from "../../../input-output-types/posts-models"
import { postsRepository } from "../posts-repository"

export const postsService = {

    findPosts: async function (queryParams: any) {

        const pageNumber = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy = queryParams.sortBy ? queryParams.sortBy : "createdAt"
        const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc'
        const searchNameTerm = queryParams.searchNameTerm ? queryParams.searchNameTerm : ""

        const allPosts = await postsRepository.getAllPosts(
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm
        )

        const mappedPosts = allPosts.map((el) => {
            let { ["_id"]: _, ...mapped } = el
            return mapped
        })

        const totalCount = await this.getDocumetnsCount(searchNameTerm)

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: mappedPosts,
        }
    },

    findPostById: async function (id: string) {
        const foundPost = await postCollection.findOne({ id: id })
        if (foundPost == null) {
            return false
        }
        let { ["_id"]: _, ...mapedPost } = foundPost
        return mapedPost
    },

    findPostsOfBlog: async function (blogId: string, pageNumber: Number, pageSize: Number, sortBy: string, sortDirection: string, searchNameTerm: string,) {
        return await postsRepository.getAllPostsOfBlog(blogId, pageNumber, pageSize, sortBy, sortDirection, searchNameTerm)
    },

    createPost: async function (postBody: PostInputModel) {
        const newPostId = await postsRepository.createPost(postBody);
        let foundPost = await this.findPostById(newPostId);
        return foundPost

    },

    updatePost: async function (id: string, postBody: PostInputModel) {
        const isBlogUpdated = await postsRepository.updatePost(id, postBody);
        return isBlogUpdated
    },

    deletePost: async function (id: string) {
        const isPostDeleted = await postsRepository.deletePost(id)
        return isPostDeleted
    },

    getDocumetnsCount: async function (searchNameTerm: string) {
        const filter: any = {}
        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' }
        }
        return await postsRepository.getDocumetnsCount(filter)
    },
    getDocumetnsCountBlog: async function (blogId: string, searchNameTerm: string) {
        const filter: any = {}
        filter.blogId = blogId
        if (searchNameTerm) {
            filter.title = { $regex: searchNameTerm, $options: 'i' }
        }
        return await postsRepository.getDocumetnsCount(filter)
    },
}
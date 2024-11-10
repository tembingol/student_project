import { BlogInputModel } from "../../../input-output-types/blogs-models"
import { PostInputModel } from "../../../input-output-types/posts-models"
import { postsService } from "../../posts/services/post-service"
import { blogsRepository } from "../blogs-repository"


export const blogsService = {

    findBlogs: async function (queryParams: any) {

        const pageNumber = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy = queryParams.sortBy ? queryParams.sortBy : "createdAt"
        const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc'
        const searchNameTerm = queryParams.searchNameTerm ? queryParams.searchNameTerm : ""

        const allBlogs = await blogsRepository.getAllBlogs(
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm
        )

        const mappedBlogs = allBlogs.map((el) => {
            let { ["_id"]: _, ...mapped } = el
            return mapped
        })

        const totalCount = await blogsRepository.getDocumetnsCount(searchNameTerm)

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: mappedBlogs,
        }
    },

    findBlogById: async function (id: string) {
        const foundBlog = await blogsRepository.getBlogByID(id);
        if (foundBlog == null) {
            return false
        }
        let { ["_id"]: _, ...mapedBlog } = foundBlog
        return mapedBlog
    },

    findBlogPosts: async function (blogId: string, queryParams: any) {

        const pageNumber = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy = queryParams.sortBy ? queryParams.sortBy : "createdAt"
        const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc'
        const searchNameTerm = queryParams.searchNameTerm ? queryParams.searchNameTerm : ""

        const foundPosts = await postsService.findPostsOfBlog(
            blogId,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm)

        const _totalCount = await postsService.getDocumetnsCountBlog(blogId, searchNameTerm)

        console.log("_totalCount " + _totalCount)

        return {
            pagesCount: Math.ceil(_totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: _totalCount,
            items: foundPosts,
        }

    },

    createBlog: async function (blogBody: BlogInputModel) {
        const newBblogId = await blogsRepository.createBlog(blogBody);
        const foundBlog = await this.findBlogById(newBblogId);
        return foundBlog
    },

    createBlogPost: async function (id: string, postBody: PostInputModel) {
        postBody.blogId = id
        const newPost = await postsService.createPost(postBody)
        return newPost
    },

    updateBlog: async function (id: string, blogBody: BlogInputModel) {
        const isBlogUpdated = await blogsRepository.updateBlog(id, blogBody);
        return isBlogUpdated
    },

    deleteBlog: async function (id: string) {
        const isBlogDeleted = await blogsRepository.deleteBlog(id)
        return isBlogDeleted
    },

    getDocumetnsCount: async function (searchNameTerm: string) {
        return await blogsRepository.getDocumetnsCount(searchNameTerm)
    }

}
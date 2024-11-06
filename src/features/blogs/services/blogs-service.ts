import { BlogInputModel, BlogResponseModel, BlogViewModel } from "../../../input-output-types/blogs-models"
import { PostInputModel } from "../../../input-output-types/posts-models"
import { postsRepository } from "../../posts/posts-repository"
import { postsService } from "../../posts/services/post-service"
import { blogsRepository } from "../blogs-repository"


export const blogsService = {

    findBlogs: async function (queryParams: any) {

        console.log("queryParams")
        console.log(queryParams)

        const pageNumber = !queryParams.pageNumber ? queryParams.pageNumber : 1
        const pageSize = !queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy = !queryParams.sortBy ? queryParams.sortBy : "createdAt"
        const sortDirection = !queryParams.sortDirection ? queryParams.sortDirection : 'asc'
        const searchNameTerm = !queryParams.searchNameTerm ? queryParams.searchNameTerm : ""

        const allBlogs = await blogsRepository.getAllBlogs(
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm
        )

        return allBlogs.map((el) => {
            let { ["_id"]: _, ...mapped } = el
            return mapped
        })
    },

    findBlogById: async function (id: string) {
        const foundBlog = await blogsRepository.getBlogByID(id);
        if (foundBlog == null) {
            return false
        }
        let { ["_id"]: _, ...mapedBlog
        } = foundBlog
        return mapedBlog
    },

    findBlogPosts: async function (blogId: string) {
        //to DO
        const trsult = await postsService.findPostsOfBlog(blogId)
        return trsult
    },

    createBlog: async function (blogBody: BlogInputModel) {
        const newBblogId = await blogsRepository.createBlog(blogBody);

        const foundBlog = await blogsRepository.getBlogByID(newBblogId);
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

}
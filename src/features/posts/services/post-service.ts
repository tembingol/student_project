import { PostInputModel } from "../../../input-output-types/posts-models"
import { postsRepository } from "../posts-repository"

export const postsService = {

    findPosts: async function (queryParams: any) {

        console.log("queryParams")
        console.log(queryParams)

        const pageNumber = !queryParams.pageNumber ? queryParams.pageNumber : 1
        const pageSize = !queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy = !queryParams.sortBy ? queryParams.sortBy : "createdAt"
        const sortDirection = !queryParams.sortDirection ? queryParams.sortDirection : 'asc'
        const searchNameTerm = !queryParams.searchNameTerm ? queryParams.searchNameTerm : ""

        // const allBlogs = await postsRepository.getAllPosts(
        //     pageNumber,
        //     pageSize,
        //     sortBy,
        //     sortDirection,
        //     searchNameTerm
        // )

        // return allBlogs.map((el) => {
        //     let { ["_id"]: _, ...mapped } = el
        //     return mapped
        // })
    },

    findPostsOfBlog: async function (blogId: string) {
        return await postsRepository.getAllPostsOfBlog(blogId)
    },

    createPost: async function (postBody: PostInputModel) {
        const newPostId = await postsRepository.createPost(postBody);

        const foundPost = await postsRepository.getPostByID(newPostId);
        return foundPost
    },
}
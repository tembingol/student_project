"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsService = void 0;
const posts_repository_1 = require("../posts-repository");
exports.postsService = {
    findPosts: function (queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("queryParams");
            console.log(queryParams);
            const pageNumber = !queryParams.pageNumber ? queryParams.pageNumber : 1;
            const pageSize = !queryParams.pageSize ? +queryParams.pageSize : 10;
            const sortBy = !queryParams.sortBy ? queryParams.sortBy : "createdAt";
            const sortDirection = !queryParams.sortDirection ? queryParams.sortDirection : 'asc';
            const searchNameTerm = !queryParams.searchNameTerm ? queryParams.searchNameTerm : "";
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
        });
    },
    findPostsOfBlog: function (blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_repository_1.postsRepository.getAllPostsOfBlog(blogId);
        });
    },
    createPost: function (postBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPostId = yield posts_repository_1.postsRepository.createPost(postBody);
            const foundPost = yield posts_repository_1.postsRepository.getPostByID(newPostId);
            return foundPost;
        });
    },
};

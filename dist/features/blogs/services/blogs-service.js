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
exports.blogsService = void 0;
const types_1 = require("../../../input-output-types/types");
const posts_service_1 = require("../../posts/services/posts-service");
const blogs_repository_1 = require("../blogs-repository");
const blogs_query_service_1 = require("./blogs-query-service");
exports.blogsService = {
    createBlog: function (blogBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                result: false,
                status: types_1.HTTP_STATUS_CODE.BadRequest,
                data: {},
                errors: { errorsMessages: [] }
            };
            const newBblogId = yield blogs_repository_1.blogsRepository.createBlog(blogBody);
            if (!newBblogId) {
                return response;
            }
            // const foundCreatedBlog = await blogsQueryRepository.getBlogByID(newBblogId.id);
            // if (!foundCreatedBlog) {
            //     return response
            // }
            if (newBblogId) {
                response.result = true;
                response.status = types_1.HTTP_STATUS_CODE.Created;
                response.data = (0, blogs_query_service_1.blogEntityMapper)(newBblogId);
            }
            return response;
        });
    },
    createBlogPost: function (id, postBody) {
        return __awaiter(this, void 0, void 0, function* () {
            postBody.blogId = id;
            const newPost = yield posts_service_1.postsService.createPost(postBody);
            return newPost;
        });
    },
    updateBlog: function (id, blogBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                result: false,
                status: types_1.HTTP_STATUS_CODE.NotFound,
                data: {},
                errors: { errorsMessages: [] }
            };
            const isBlogUpdated = yield blogs_repository_1.blogsRepository.updateBlog(id, blogBody);
            if (isBlogUpdated) {
                response.result = true;
                response.status = types_1.HTTP_STATUS_CODE.NoContent;
            }
            return response;
        });
    },
    deleteBlog: function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                result: false,
                status: types_1.HTTP_STATUS_CODE.NotFound,
                data: {},
                errors: { errorsMessages: [] }
            };
            const isBlogDeleted = yield blogs_repository_1.blogsRepository.deleteBlog(id);
            if (isBlogDeleted) {
                response.result = true;
                response.status = types_1.HTTP_STATUS_CODE.NoContent;
            }
            return response;
        });
    },
};

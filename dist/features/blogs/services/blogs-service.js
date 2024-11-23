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
const posts_service_1 = require("../../posts/services/posts-service");
const blogs_query_repository_1 = require("../blogs-query-repository");
const blogs_repository_1 = require("../blogs-repository");
const blogs_query_service_1 = require("./blogs-query-service");
exports.blogsService = {
    createBlog: function (blogBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                result: false,
                status: 400,
                data: {},
                errors: { errorsMessages: [] }
            };
            const newBlog = {
                "id": "",
                "name": blogBody.name,
                "description": blogBody.description,
                "websiteUrl": blogBody.websiteUrl,
                "createdAt": new Date().toISOString(),
                "isMembership": false,
            };
            const newBblogId = yield blogs_repository_1.blogsRepository.createBlog(newBlog);
            if (newBblogId === "") {
                return response;
            }
            const foundCreatedBlog = yield blogs_query_repository_1.blogsQueryRepository.getBlogByID({ id: newBblogId });
            if (foundCreatedBlog) {
                response.result = true;
                response.status = 201;
                response.data = (0, blogs_query_service_1.blogEntityMapper)(foundCreatedBlog);
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
                status: 404,
                data: {},
                errors: { errorsMessages: [] }
            };
            const isBlogUpdated = yield blogs_repository_1.blogsRepository.updateBlog(id, blogBody);
            if (isBlogUpdated) {
                response.result = true;
                response.status = 204;
            }
            return response;
        });
    },
    deleteBlog: function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                result: false,
                status: 404,
                data: {},
                errors: { errorsMessages: [] }
            };
            const isBlogDeleted = yield blogs_repository_1.blogsRepository.deleteBlog(id);
            if (isBlogDeleted) {
                response.result = true;
                response.status = 204;
            }
            return response;
        });
    },
};

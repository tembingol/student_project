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
exports.blogsQueryService = void 0;
exports.blogEntityMapper = blogEntityMapper;
const post_service_1 = require("../../posts/services/post-service");
const blogs_query_repository_1 = require("../blogs-query-repository");
exports.blogsQueryService = {
    findBlogs: function (queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const pageNumber = queryParams.pageNumber ? +queryParams.pageNumber : 1;
            const pageSize = queryParams.pageSize ? +queryParams.pageSize : 10;
            const sortBy = queryParams.sortBy ? queryParams.sortBy : "createdAt";
            const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc';
            const searchNameTerm = queryParams.searchNameTerm ? queryParams.searchNameTerm : "";
            const filter = {};
            if (searchNameTerm) {
                filter.name = { $regex: searchNameTerm, $options: 'i' };
            }
            const allBlogs = yield blogs_query_repository_1.blogsQueryRepository.getAllBlogs(pageNumber, pageSize, sortBy, sortDirection, filter);
            const mappedAllBlogs = allBlogs.map((el) => blogEntityMapper(el));
            const totalCount = yield blogs_query_repository_1.blogsQueryRepository.getDocumetnsCount(filter);
            const result = {
                result: true,
                status: 200,
                data: {
                    pagesCount: Math.ceil(totalCount / pageSize),
                    page: pageNumber,
                    pageSize: pageSize,
                    totalCount: totalCount,
                    items: mappedAllBlogs,
                },
                errors: { errorsMessages: [] }
            };
            return result;
        });
    },
    findBlogById: function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = {
                result: false,
                status: 404,
                data: {},
                errors: { errorsMessages: ["Not found"] }
            };
            const filter = { id: id };
            const foundBlog = yield blogs_query_repository_1.blogsQueryRepository.getBlogByID(filter);
            if (foundBlog) {
                result.result = true;
                result.status = 200;
                result.data = blogEntityMapper(foundBlog);
                result.errors = { errorsMessages: [] };
            }
            return result;
        });
    },
    getDocumetnsCount: function (searchNameTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            if (searchNameTerm) {
                filter.name = { $regex: searchNameTerm, $options: 'i' };
            }
            const result = yield blogs_query_repository_1.blogsQueryRepository.getDocumetnsCount(filter);
            return result;
        });
    },
    findPostsOfBlog: function (blogId, queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const pageNumber = queryParams.pageNumber ? +queryParams.pageNumber : 1;
            const pageSize = queryParams.pageSize ? +queryParams.pageSize : 10;
            const sortBy = queryParams.sortBy ? queryParams.sortBy : "createdAt";
            const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc';
            const searchNameTerm = queryParams.searchNameTerm ? queryParams.searchNameTerm : "";
            const foundPosts = yield post_service_1.postsService.findPostsOfBlog(blogId, pageNumber, pageSize, sortBy, sortDirection, searchNameTerm);
            const _totalCount = yield post_service_1.postsService.getDocumetnsCountBlog(blogId, searchNameTerm);
            console.log("_totalCount " + _totalCount);
            const result = {
                result: true,
                status: 200,
                data: {
                    pagesCount: Math.ceil(_totalCount / pageSize),
                    page: pageNumber,
                    pageSize: pageSize,
                    totalCount: _totalCount,
                    items: foundPosts,
                },
                errors: { errorsMessages: [] }
            };
            return result;
        });
    },
};
function blogEntityMapper(blog) {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
    };
}

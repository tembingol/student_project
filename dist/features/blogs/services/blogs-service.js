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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsService = void 0;
const post_service_1 = require("../../posts/services/post-service");
const blogs_repository_1 = require("../blogs-repository");
exports.blogsService = {
    findBlogs: function (queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("queryParams");
            console.log(queryParams);
            const pageNumber = !queryParams.pageNumber ? queryParams.pageNumber : 1;
            const pageSize = !queryParams.pageSize ? +queryParams.pageSize : 10;
            const sortBy = !queryParams.sortBy ? queryParams.sortBy : "createdAt";
            const sortDirection = !queryParams.sortDirection ? queryParams.sortDirection : 'asc';
            const searchNameTerm = !queryParams.searchNameTerm ? queryParams.searchNameTerm : "";
            const allBlogs = yield blogs_repository_1.blogsRepository.getAllBlogs(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm);
            return allBlogs.map((el) => {
                let { ["_id"]: _ } = el, mapped = __rest(el, ["_id"]);
                return mapped;
            });
        });
    },
    findBlogById: function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield blogs_repository_1.blogsRepository.getBlogByID(id);
            if (foundBlog == null) {
                return false;
            }
            let { ["_id"]: _ } = foundBlog, mapedBlog = __rest(foundBlog, ["_id"]);
            return mapedBlog;
        });
    },
    findBlogPosts: function (blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            //to DO
            const trsult = yield post_service_1.postsService.findPostsOfBlog(blogId);
            return trsult;
        });
    },
    createBlog: function (blogBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBblogId = yield blogs_repository_1.blogsRepository.createBlog(blogBody);
            const foundBlog = yield blogs_repository_1.blogsRepository.getBlogByID(newBblogId);
            return foundBlog;
        });
    },
    createBlogPost: function (id, postBody) {
        return __awaiter(this, void 0, void 0, function* () {
            postBody.blogId = id;
            const newPost = yield post_service_1.postsService.createPost(postBody);
            return newPost;
        });
    },
    updateBlog: function (id, blogBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const isBlogUpdated = yield blogs_repository_1.blogsRepository.updateBlog(id, blogBody);
            return isBlogUpdated;
        });
    },
    deleteBlog: function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            const isBlogDeleted = yield blogs_repository_1.blogsRepository.deleteBlog(id);
            return isBlogDeleted;
        });
    },
};

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
exports.postsService = void 0;
const mongodb_1 = require("../../../db/mongodb");
const posts_repository_1 = require("../posts-repository");
exports.postsService = {
    findPosts: function (queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("queryParams");
            console.log(queryParams);
            const pageNumber = queryParams.pageNumber ? +queryParams.pageNumber : 1;
            const pageSize = queryParams.pageSize ? +queryParams.pageSize : 10;
            const sortBy = !queryParams.sortBy ? queryParams.sortBy : "createdAt";
            const sortDirection = !queryParams.sortDirection ? queryParams.sortDirection : 'asc';
            const searchNameTerm = !queryParams.searchNameTerm ? queryParams.searchNameTerm : "";
            const allBlogs = yield posts_repository_1.postsRepository.getAllPosts(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm);
            allBlogs.map((el) => {
                let { ["_id"]: _ } = el, mapped = __rest(el, ["_id"]);
                return mapped;
            });
            const totalCount = yield posts_repository_1.postsRepository.getDocumetnsCount(searchNameTerm);
            return {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount,
                items: allBlogs,
            };
        });
    },
    findPostById: function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield mongodb_1.postCollection.findOne({ id: id });
            return foundBlog;
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
            const foundBlog = yield posts_repository_1.postsRepository.getPostByID(newPostId);
            return foundBlog;
        });
    },
    updatePost: function (id, postBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const isBlogUpdated = yield posts_repository_1.postsRepository.updatePost(id, postBody);
            return isBlogUpdated;
        });
    },
    deletePost: function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            const isBlogDeleted = yield posts_repository_1.postsRepository.deletePost(id);
            return isBlogDeleted;
        });
    },
};

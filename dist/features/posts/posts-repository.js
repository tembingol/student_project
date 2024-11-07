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
exports.postsRepository = void 0;
const mongodb_1 = require("mongodb");
const mongodb_2 = require("../../db/mongodb");
exports.postsRepository = {
    getAllPosts: function (pageNumber, pageSize, sortBy, sortDirection, searchNameTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            if (searchNameTerm) {
                filter.title = { $regex: searchNameTerm, $option: 'i' };
            }
            const _pageNumber = +pageNumber;
            const _pageSize = +pageSize;
            const _sortDirection = sortDirection === 'asc' ? 1 : -1;
            const allPosts = yield mongodb_2.postCollection.find(filter)
                .skip((_pageNumber - 1) * _pageSize)
                .limit(_pageSize)
                .sort({ [sortBy]: _sortDirection })
                .toArray();
            return allPosts;
        });
    },
    getAllPostsOfBlog: function (blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allPosts = yield mongodb_2.postCollection.find({ "blogId": blogId }).toArray();
            return allPosts.map((el) => {
                let { ["_id"]: _ } = el, mapped = __rest(el, ["_id"]);
                return mapped;
            });
        });
    },
    getPostByID: function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundPost = yield mongodb_2.postCollection.findOne({ id: id });
            return foundPost;
        });
    },
    createPost: function (reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPostObjectId = new mongodb_1.ObjectId();
            const newPost = {
                "_id": newPostObjectId,
                "id": newPostObjectId.toString(),
                "title": reqBody.title,
                "shortDescription": reqBody.shortDescription,
                "content": reqBody.content,
                "blogId": reqBody.blogId,
                "blogName": "",
                "createdAt": new Date().toISOString(),
            };
            const insertResult = yield mongodb_2.postCollection.insertOne(newPost);
            return insertResult.insertedId.toString();
        });
    },
    updatePost: function (id, postBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_2.postCollection.updateOne({ id: id }, {
                $set: {
                    title: postBody.title,
                    shortDescription: postBody.shortDescription,
                    content: postBody.content,
                    blogId: postBody.blogId,
                    blogName: !postBody.blogName ? "" : postBody.blogName
                }
            });
            return result.matchedCount === 1;
        });
    },
    deletePost: function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_2.postCollection.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    },
    getDocumetnsCount: function (searchNameTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            if (searchNameTerm) {
                filter.title = { $regex: searchNameTerm, $option: 'i' };
            }
            return yield mongodb_2.postCollection.countDocuments(filter);
        });
    }
};

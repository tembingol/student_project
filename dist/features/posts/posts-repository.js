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
    getAllPosts: function () {
        return __awaiter(this, void 0, void 0, function* () {
            const allPosts = yield mongodb_2.postCollection.find().toArray();
            return allPosts.map((el) => {
                let { ["_id"]: _ } = el, mapped = __rest(el, ["_id"]);
                return mapped;
            });
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
            if (!foundPost) {
                return false;
            }
            let { ["_id"]: _ } = foundPost, mapedPost = __rest(foundPost, ["_id"]);
            return mapedPost;
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
    updatePost: function (id, reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield mongodb_2.postCollection.updateOne({ id: id }, {
                    $set: {
                        title: reqBody.title,
                        shortDescription: reqBody.shortDescription,
                        content: reqBody.content,
                        blogId: reqBody.blogId,
                        blogName: !reqBody.blogName ? "" : reqBody.blogName
                    }
                });
                if (result.modifiedCount > 0) {
                    return true;
                }
            }
            catch (err) {
                console.error(err);
            }
            return false;
        });
    },
    deletePost: function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield mongodb_2.postCollection.deleteOne({ id: id });
                if (result.deletedCount > 0) {
                    return true;
                }
            }
            catch (err) {
                console.error(err);
            }
            return false;
        });
    }
};

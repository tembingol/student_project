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
exports.blogsRepository = void 0;
const mongodb_1 = require("mongodb");
const mongodb_2 = require("../../db/mongodb");
exports.blogsRepository = {
    getAllBlogs: function () {
        return __awaiter(this, void 0, void 0, function* () {
            const allBlogs = yield mongodb_2.blogCollection.find({}).toArray();
            return allBlogs.map((el) => {
                let { ["_id"]: _ } = el, mapped = __rest(el, ["_id"]);
                return mapped;
            });
        });
    },
    getBlogByID: function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield mongodb_2.blogCollection.findOne({ id: id });
            if (foundBlog == null) {
                return false;
            }
            let { ["_id"]: _ } = foundBlog, mapedBlog = __rest(foundBlog, ["_id"]);
            return mapedBlog;
        });
    },
    createBlog: function (reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = {
                result: false,
                id: ""
            };
            const newBlogObjectId = new mongodb_1.ObjectId();
            const newBlog = {
                "_id": newBlogObjectId,
                "id": newBlogObjectId.toString(),
                "name": reqBody.name,
                "description": reqBody.description,
                "websiteUrl": reqBody.websiteUrl,
                "createdAt": new Date().toISOString(),
                "isMembership": false,
            };
            try {
                const insertResult = yield mongodb_2.blogCollection.insertOne(newBlog);
                result.result = true;
                result.id = insertResult.insertedId.toString();
            }
            catch (err) {
                console.error(err);
            }
            return result;
        });
    },
    updateBlog: function (id, reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield mongodb_2.blogCollection.updateOne({ id: id }, {
                    $set: {
                        name: reqBody.name,
                        description: reqBody.description,
                        websiteUrl: reqBody.websiteUrl
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
    deleteBlog: function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield mongodb_2.blogCollection.deleteOne({ id: id });
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

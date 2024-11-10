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
exports.blogsRepository = void 0;
const mongodb_1 = require("mongodb");
const mongodb_2 = require("../../db/mongodb");
exports.blogsRepository = {
    getAllBlogs: function (pageNumber, pageSize, sortBy, sortDirection, searchNameTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            if (searchNameTerm) {
                filter.name = { $regex: searchNameTerm, $options: 'i' };
            }
            const _pageNumber = +pageNumber;
            const _pageSize = +pageSize;
            const _sortDirection = sortDirection === 'asc' ? 1 : -1;
            console.log("getAllBlogs_sortDirection  %s", _sortDirection);
            console.log("getAllBlogs_filter  %s", filter);
            console.log(filter);
            console.log("getAllBlogs_sortBy  %s", sortBy);
            const allBlogs = yield mongodb_2.blogCollection.find(filter)
                .skip((_pageNumber - 1) * _pageSize)
                .limit(_pageSize)
                .sort({ [sortBy]: _sortDirection })
                .toArray();
            return allBlogs;
        });
    },
    getBlogByID: function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield mongodb_2.blogCollection.findOne({ id: id });
            return foundBlog;
        });
    },
    createBlog: function (blogBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlogObjectId = new mongodb_1.ObjectId();
            const newBlog = {
                "_id": newBlogObjectId,
                "id": newBlogObjectId.toString(),
                "name": blogBody.name,
                "description": blogBody.description,
                "websiteUrl": blogBody.websiteUrl,
                "createdAt": new Date().toISOString(),
                "isMembership": false,
            };
            const insertResult = yield mongodb_2.blogCollection.insertOne(newBlog);
            return insertResult.insertedId.toString();
        });
    },
    updateBlog: function (id, blogBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_2.blogCollection.updateOne({ id: id }, {
                $set: {
                    name: blogBody.name,
                    description: blogBody.description,
                    websiteUrl: blogBody.websiteUrl
                }
            });
            return result.matchedCount === 1;
        });
    },
    deleteBlog: function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_2.blogCollection.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    },
    getDocumetnsCount: function (searchNameTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            if (searchNameTerm) {
                filter.name = { $regex: searchNameTerm, $options: 'i' };
            }
            console.log('getDocumetnsCount Logger \n{--');
            console.log('filter %s', filter);
            console.log(filter);
            console.log('--}');
            return yield mongodb_2.blogCollection.countDocuments(filter);
        });
    }
};

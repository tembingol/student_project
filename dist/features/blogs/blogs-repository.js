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
    createBlog: function (blog) {
        return __awaiter(this, void 0, void 0, function* () {
            const newObjectId = new mongodb_1.ObjectId();
            const newBlog = Object.assign(Object.assign({}, blog), { _id: newObjectId, id: newObjectId.toString() });
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
};

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
exports.postsRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../../db/db");
exports.postsRepository = {
    createPost: function (post) {
        return __awaiter(this, void 0, void 0, function* () {
            const newObjectId = new mongodb_1.ObjectId();
            const newPost = Object.assign(Object.assign({}, post), { _id: newObjectId, id: newObjectId.toString() });
            const insertResult = yield db_1.db.getCollections().postCollection.insertOne(newPost);
            return insertResult.insertedId.toString();
        });
    },
    updatePost: function (id, postBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.db.getCollections().postCollection.updateOne({ id: id }, {
                $set: {
                    title: postBody.title,
                    shortDescription: postBody.shortDescription,
                    content: postBody.content,
                    blogId: postBody.blogId,
                    blogName: postBody.blogName ? postBody.blogName : ""
                }
            });
            return result.matchedCount === 1;
        });
    },
    deletePost: function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.db.getCollections().postCollection.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    },
};

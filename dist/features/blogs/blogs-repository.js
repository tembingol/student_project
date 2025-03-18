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
const blogs_models_1 = require("../../input-output-types/blogs-models");
exports.blogsRepository = {
    createBlog: function (blog) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = new blogs_models_1.BlogModel(blog);
            yield newBlog.save();
            return newBlog.toObject();
        });
    },
    updateBlog: function (id, blogBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield blogs_models_1.BlogModel.findOne({ _id: id });
            if (!foundBlog) {
                return false;
            }
            foundBlog.name = blogBody.name;
            foundBlog.description = blogBody.description;
            foundBlog.websiteUrl = blogBody.websiteUrl;
            yield foundBlog.save();
            return true;
        });
    },
    deleteBlog: function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield blogs_models_1.BlogModel.findOne({ _id: id });
            if (!foundBlog) {
                return false;
            }
            yield foundBlog.deleteOne();
            return true;
        });
    },
};

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
exports.blogsRouter = void 0;
const express_1 = require("express");
const base_auth_middleware_1 = require("../../global-middlewares/base-auth-middleware");
const blogs_repository_1 = require("./blogs-repository");
const blog_validators_1 = require("./middlewares/blog-validators");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allBlogs = yield blogs_repository_1.blogsRepository.getAllBlogs();
    res.status(200).json(allBlogs);
}));
exports.blogsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundBlog = yield blogs_repository_1.blogsRepository.getBlogByID(req.params.id);
    if (!foundBlog) {
        res.sendStatus(404);
        return;
    }
    res.status(200).json(foundBlog);
}));
exports.blogsRouter.post('/', ...blog_validators_1.blogValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isNewBblogCreated = yield blogs_repository_1.blogsRepository.createBlog(req.body);
    if (isNewBblogCreated.result === false) {
        res.sendStatus(400);
        return;
    }
    const foundBlog = yield blogs_repository_1.blogsRepository.getBlogByID(isNewBblogCreated.id);
    res.status(201).json(foundBlog);
}));
exports.blogsRouter.put('/:id', ...blog_validators_1.blogValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isBlogUpdated = yield blogs_repository_1.blogsRepository.updateBlog(req.params.id, req.body);
    if (!isBlogUpdated) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
}));
exports.blogsRouter.delete('/:id', base_auth_middleware_1.baseAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isBlogDeleted = yield blogs_repository_1.blogsRepository.deleteBlog(req.params.id);
    if (!isBlogDeleted) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
}));

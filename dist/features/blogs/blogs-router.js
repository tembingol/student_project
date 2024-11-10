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
const blog_validators_1 = require("./middlewares/blog-validators");
const blogs_service_1 = require("./services/blogs-service");
const post_validators_1 = require("../posts/middlewares/post-validators");
const input_Check_Errors_Middleware_1 = require("../../global-middlewares/input-Check-Errors-Middleware");
exports.blogsRouter = (0, express_1.Router)({});
// // simple logger for this router's requests
// // all requests to this router will first hit this middleware
// blogsRouter.use(function (req, res, next) {
//     console.log('blogsRouter Logger \n{--')
//     console.log('%s ,%s ,%s', req.method, req.body, req.baseUrl + req.url)
//     console.log('--}')
//     next()
// })
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allBlogs = yield blogs_service_1.blogsService.findBlogs(req.query);
    res.status(200).json(allBlogs);
}));
exports.blogsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundBlog = yield blogs_service_1.blogsService.findBlogById(req.params.id);
    if (!foundBlog) {
        res.sendStatus(404);
        return;
    }
    res.status(200).json(foundBlog);
}));
exports.blogsRouter.get('/:id/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blogs_service_1.blogsService.findBlogById(req.params.id);
    if (!blog) {
        res.sendStatus(404);
        return;
    }
    const allPostsofBlog = yield blogs_service_1.blogsService.findBlogPosts(req.params.id, req.query);
    if (!allPostsofBlog) {
        res.sendStatus(404);
        return;
    }
    res.status(200).json(allPostsofBlog);
}));
exports.blogsRouter.post('/', ...blog_validators_1.blogValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newBblog = yield blogs_service_1.blogsService.createBlog(req.body);
    if (!newBblog) {
        res.sendStatus(400);
        return;
    }
    res.status(201).json(newBblog);
}));
exports.blogsRouter.post('/:id/posts', base_auth_middleware_1.baseAuthMiddleware, post_validators_1.titleValidator, post_validators_1.shortDescriptionValidator, post_validators_1.contentValidator, input_Check_Errors_Middleware_1.inputCheckErrorsMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blogs_service_1.blogsService.findBlogById(req.params.id);
    if (!blog) {
        res.sendStatus(404);
        return;
    }
    const newBblogPost = yield blogs_service_1.blogsService.createBlogPost(req.params.id, req.body);
    if (!newBblogPost) {
        res.sendStatus(400);
        return;
    }
    res.status(201).json(newBblogPost);
}));
exports.blogsRouter.put('/:id', ...blog_validators_1.blogValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isBlogUpdated = yield blogs_service_1.blogsService.updateBlog(req.params.id, req.body);
    if (!isBlogUpdated) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
}));
exports.blogsRouter.delete('/:id', base_auth_middleware_1.baseAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isBlogDeleted = yield blogs_service_1.blogsService.deleteBlog(req.params.id);
    if (!isBlogDeleted) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
}));

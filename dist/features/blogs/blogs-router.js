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
const blogs_query_service_1 = require("./services/blogs-query-service");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceRes = yield blogs_query_service_1.blogsQueryService.findBlogs(req.query);
    res.status(serviceRes.status).json(serviceRes.data);
}));
exports.blogsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceRes = yield blogs_query_service_1.blogsQueryService.findBlogById(req.params.id);
    if (!serviceRes.result) {
        res.sendStatus(serviceRes.status);
        return;
    }
    res.status(serviceRes.status).json(serviceRes.data);
}));
exports.blogsRouter.get('/:id/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceRes = yield blogs_query_service_1.blogsQueryService.findBlogById(req.params.id);
    if (!serviceRes.result) {
        res.sendStatus(serviceRes.status);
        return;
    }
    const foundPostsOfBlog = yield blogs_query_service_1.blogsQueryService.findPostsOfBlog(req.params.id, req.query);
    res.status(foundPostsOfBlog.status).json(foundPostsOfBlog.data);
}));
exports.blogsRouter.post('/', ...blog_validators_1.blogValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceRes = yield blogs_service_1.blogsService.createBlog(req.body);
    res.status(serviceRes.status).json(serviceRes.data);
}));
exports.blogsRouter.post('/:id/posts', base_auth_middleware_1.baseAuthMiddleware, post_validators_1.titleValidator, post_validators_1.shortDescriptionValidator, post_validators_1.contentValidator, input_Check_Errors_Middleware_1.inputCheckErrorsMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blogs_query_service_1.blogsQueryService.findBlogById(req.params.id);
    if (!blog.result) {
        res.sendStatus(blog.status);
        return;
    }
    const newBblogPost = yield blogs_service_1.blogsService.createBlogPost(req.params.id, req.body);
    if (!newBblogPost.result) {
        res.sendStatus(newBblogPost.status);
        return;
    }
    res.status(newBblogPost.status).json(newBblogPost.data);
}));
exports.blogsRouter.put('/:id', ...blog_validators_1.blogValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceRes = yield blogs_service_1.blogsService.updateBlog(req.params.id, req.body);
    if (!serviceRes.result) {
        res.sendStatus(serviceRes.status);
        return;
    }
    res.status(serviceRes.status).json(serviceRes.data);
}));
exports.blogsRouter.delete('/:id', base_auth_middleware_1.baseAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceRes = yield blogs_service_1.blogsService.deleteBlog(req.params.id);
    if (!serviceRes.result) {
        res.sendStatus(serviceRes.status);
        return;
    }
    res.status(serviceRes.status).json(serviceRes.data);
}));

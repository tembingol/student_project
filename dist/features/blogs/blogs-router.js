"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const base_auth_middleware_1 = require("../../global-middlewares/base-auth-middleware");
const blogs_repository_1 = require("./blogs-repository");
const blog_validators_1 = require("./middlewares/blog-validators");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => {
    const allBlogs = blogs_repository_1.blogsRepository.getAllBlogs();
    res.status(200).json(allBlogs);
});
exports.blogsRouter.get('/:id', (req, res) => {
    const foundBlog = blogs_repository_1.blogsRepository.getBlogByID(req.params.id);
    if (!foundBlog) {
        res.sendStatus(404);
        return;
    }
    res.status(200).json(foundBlog);
});
exports.blogsRouter.post('/', ...blog_validators_1.blogValidators, (req, res) => {
    const newBlogID = blogs_repository_1.blogsRepository.createBlog(req.body);
    if (!newBlogID) {
        res.sendStatus(400);
        return;
    }
    const foundBlog = blogs_repository_1.blogsRepository.getBlogByID(newBlogID);
    res.status(201).json(foundBlog);
});
exports.blogsRouter.put('/:id', ...blog_validators_1.blogValidators, (req, res) => {
    const isBlogUpdated = blogs_repository_1.blogsRepository.updateBlog(req.params.id, req.body);
    if (!isBlogUpdated) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
});
exports.blogsRouter.delete('/:id', base_auth_middleware_1.baseAuthMiddleware, (req, res) => {
    const isBlogDeleted = blogs_repository_1.blogsRepository.deleteBlog(req.params.id);
    if (!isBlogDeleted) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
});

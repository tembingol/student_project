"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = require("express");
const base_auth_middleware_1 = require("../../global-middlewares/base-auth-middleware");
const posts_repository_1 = require("./posts-repository");
const post_validators_1 = require("./middlewares/post-validators");
exports.postRouter = (0, express_1.Router)({});
exports.postRouter.get('/', (req, res) => {
    const foudPosts = posts_repository_1.postsRepository.getAllPosts();
    res.status(200).json(foudPosts);
});
exports.postRouter.get('/:id', (req, res) => {
    const fuondPost = posts_repository_1.postsRepository.getPostByID(req.params.id);
    if (!fuondPost) {
        res.sendStatus(404);
        return;
    }
    res.status(200).json(fuondPost);
});
exports.postRouter.post('/', ...post_validators_1.postValidators, (req, res) => {
    const newPostId = posts_repository_1.postsRepository.createPost(req.body);
    if (!newPostId) {
        res.sendStatus(400);
        return;
    }
    const foundPost = posts_repository_1.postsRepository.getPostByID(newPostId);
    res.status(201).json(foundPost);
});
exports.postRouter.put('/:id', ...post_validators_1.postValidators, (req, res) => {
    const isPostUpdated = posts_repository_1.postsRepository.updatePost(req.params.id, req.body);
    if (!isPostUpdated) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
});
exports.postRouter.delete('/:id', base_auth_middleware_1.baseAuthMiddleware, (req, res) => {
    const isPostDeleted = posts_repository_1.postsRepository.deletePost(req.params.id);
    if (!isPostDeleted) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
});

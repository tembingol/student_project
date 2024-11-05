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
exports.postRouter = void 0;
const express_1 = require("express");
const base_auth_middleware_1 = require("../../global-middlewares/base-auth-middleware");
const posts_repository_1 = require("./posts-repository");
const post_validators_1 = require("./middlewares/post-validators");
exports.postRouter = (0, express_1.Router)({});
exports.postRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foudPosts = yield posts_repository_1.postsRepository.getAllPosts();
    res.status(200).json(foudPosts);
}));
exports.postRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fuondPost = yield posts_repository_1.postsRepository.getPostByID(req.params.id);
    if (!fuondPost) {
        res.sendStatus(404);
        return;
    }
    res.status(200).json(fuondPost);
}));
exports.postRouter.post('/', ...post_validators_1.postValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPostId = yield posts_repository_1.postsRepository.createPost(req.body);
    if (newPostId.result === false) {
        res.sendStatus(400);
        return;
    }
    const foundPost = yield posts_repository_1.postsRepository.getPostByID(newPostId.id);
    res.status(201).json(foundPost);
}));
exports.postRouter.put('/:id', ...post_validators_1.postValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isPostUpdated = yield posts_repository_1.postsRepository.updatePost(req.params.id, req.body);
    if (!isPostUpdated) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
}));
exports.postRouter.delete('/:id', base_auth_middleware_1.baseAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isPostDeleted = yield posts_repository_1.postsRepository.deletePost(req.params.id);
    if (!isPostDeleted) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
}));

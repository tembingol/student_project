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
const post_validators_1 = require("./middlewares/post-validators");
const posts_service_1 = require("./services/posts-service");
const posts_query_service_1 = require("./services/posts-query-service");
const comments_query_service_1 = require("../comments/services/comments-query-service");
const comments_service_1 = require("../comments/services/comments-service");
exports.postRouter = (0, express_1.Router)({});
// simple logger for this router's requests
// all requests to this router will first hit this middleware
// postRouter.use(function (req, res, next) {
//     console.log('postRouter Logger \n{--')
//     console.log('%s ,%s ,%s', req.method, req.body, req.baseUrl + req.url)
//     console.log('--}')
//     next()
// })
exports.postRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceRes = yield posts_query_service_1.postsQueryService.findPosts(req.query);
    res.status(serviceRes.status).json(serviceRes.data);
}));
exports.postRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceRes = yield posts_query_service_1.postsQueryService.findPostById(req.params.id);
    if (!serviceRes.result) {
        res.sendStatus(serviceRes.status);
        return;
    }
    res.status(serviceRes.status).json(serviceRes.data);
}));
exports.postRouter.get('/:id/comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundPost = yield posts_query_service_1.postsQueryService.findPostById(req.params.id);
    if (!foundPost.result) {
        res.sendStatus(foundPost.status);
        return;
    }
    const foundCommentsOfPost = yield comments_query_service_1.commentsQueryService.findCommentsOfPost(req.params.id, req.query);
    res.status(foundCommentsOfPost.status).json(foundCommentsOfPost.data);
}));
exports.postRouter.post('/:id/comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundPost = yield posts_query_service_1.postsQueryService.findPostById(req.params.id);
    if (!foundPost.result) {
        res.sendStatus(foundPost.status);
        return;
    }
    const commentatorInfo = {
        userId: "userId",
        userLogin: "string",
    };
    const newComment = yield comments_service_1.commentsService.addCommentToPost(req.params.id, req.body, commentatorInfo);
    if (!newComment.result) {
        res.sendStatus(newComment.status);
        return;
    }
    res.status(newComment.status).json(newComment.data);
}));
exports.postRouter.post('/', ...post_validators_1.postValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceRes = yield posts_service_1.postsService.createPost(req.body);
    res.status(serviceRes.status).json(serviceRes.data);
}));
exports.postRouter.put('/:id', ...post_validators_1.postValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceRes = yield posts_service_1.postsService.updatePost(req.params.id, req.body);
    if (!serviceRes.result) {
        res.sendStatus(serviceRes.status);
        return;
    }
    res.status(serviceRes.status).json(serviceRes.data);
}));
exports.postRouter.delete('/:id', base_auth_middleware_1.baseAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceRes = yield posts_service_1.postsService.deletePost(req.params.id);
    if (!serviceRes.result) {
        res.sendStatus(serviceRes.status);
        return;
    }
    res.status(serviceRes.status).json(serviceRes.data);
}));

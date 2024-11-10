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
const post_service_1 = require("./services/post-service");
exports.postRouter = (0, express_1.Router)({});
// simple logger for this router's requests
// all requests to this router will first hit this middleware
exports.postRouter.use(function (req, res, next) {
    console.log('postRouter Logger \n{--');
    console.log('%s ,%s ,%s', req.method, req.body, req.baseUrl + req.url);
    console.log('--}');
    next();
});
exports.postRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foudPosts = yield post_service_1.postsService.findPosts(req.query);
    res.status(200).json(foudPosts);
}));
exports.postRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fuondPost = yield post_service_1.postsService.findPostById(req.params.id);
    if (!fuondPost) {
        res.sendStatus(404);
        return;
    }
    res.status(200).json(fuondPost);
}));
exports.postRouter.post('/', ...post_validators_1.postValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newBblog = yield post_service_1.postsService.createPost(req.body);
    if (!newBblog) {
        res.sendStatus(400);
        return;
    }
    res.status(201).json(newBblog);
}));
exports.postRouter.put('/:id', ...post_validators_1.postValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isPostUpdated = yield post_service_1.postsService.updatePost(req.params.id, req.body);
    if (!isPostUpdated) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
}));
exports.postRouter.delete('/:id', base_auth_middleware_1.baseAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isPostDeleted = yield post_service_1.postsService.deletePost(req.params.id);
    if (!isPostDeleted) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
}));

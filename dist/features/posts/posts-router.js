"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = require("express");
const base_auth_middleware_1 = require("../../global-middlewares/base-auth-middleware");
const post_validators_1 = require("./middlewares/post-validators");
const comments_validators_1 = require("../comments/middlewares/comments-validators");
const jwt_auth_middleware_1 = require("../../global-middlewares/jwt-auth-middleware");
const posts_controller_1 = require("./posts-controller");
const composition_root_1 = require("../../composition-root");
exports.postRouter = (0, express_1.Router)({});
const commentsController = composition_root_1.container.get(posts_controller_1.PostsController);
exports.postRouter.get('/', commentsController.getAllPosts.bind(commentsController));
exports.postRouter.get('/:id', commentsController.getPostById.bind(commentsController));
// postRouter.get('/:id', async (req, res) => {
//     const serviceRes = await postsQueryService.findPostById(req.params.id)
//     if (!serviceRes.result) {
//         res.sendStatus(serviceRes.status)
//         return
//     }
//     res.status(serviceRes.status).json(serviceRes.data)
// })
exports.postRouter.get('/:id/comments', commentsController.getCommentsOfPost.bind(commentsController));
// postRouter.get('/:id/comments', async (req, res) => {
//     const foundPost = await postsQueryService.findPostById(req.params.id);
//     if (!foundPost.result) {
//         res.sendStatus(foundPost.status)
//         return
//     }
//     const foundCommentsOfPost = await commentsQueryService.findCommentsOfPost(req.params.id, req.query);
//     res.status(foundCommentsOfPost.status).json(foundCommentsOfPost.data)
// })
exports.postRouter.post('/:id/comments', jwt_auth_middleware_1.authMiddleware, ...comments_validators_1.commentValidators, commentsController.addCommentToPost.bind(commentsController));
// postRouter.post('/:id/comments', authMiddleware, ...commentValidators, async (req, res) => {
//     const content = req.body.content
//     const foundPost = await postsQueryService.findPostById(req.params.id);
//     if (!foundPost.result) {
//         res.sendStatus(foundPost.status)
//         return
//     }
//     const loginedUser = req.context!.currentUser
//     const newCommentResult = await commentsService.addCommentToPost(req.params.id, content, loginedUser);
//     if (!newCommentResult.result) {
//         res.sendStatus(newCommentResult.status)
//         return
//     }
//     res.status(newCommentResult.status).json(newCommentResult.data)
// })
exports.postRouter.post('/', ...post_validators_1.postValidators, commentsController.createPost.bind(commentsController));
// postRouter.post('/', ...postValidators, async (req, res) => {
//     const serviceRes = await postsService.createPost(req.body);
//     res.status(serviceRes.status).json(serviceRes.data)
// })
exports.postRouter.put('/', ...post_validators_1.postValidators, commentsController.updatePost.bind(commentsController));
// postRouter.put('/:id', ...postValidators, async (req, res) => {
//     const serviceRes = await postsService.updatePost(req.params.id, req.body);
//     if (!serviceRes.result) {
//         res.sendStatus(serviceRes.status)
//         return
//     }
//     res.status(serviceRes.status).json(serviceRes.data)
// })
exports.postRouter.delete('/', base_auth_middleware_1.baseAuthMiddleware, commentsController.deletePost.bind(commentsController));
// postRouter.delete('/:id', baseAuthMiddleware, async (req, res) => {
//     const serviceRes = await postsService.deletePost(req.params.id)
//     if (!serviceRes.result) {
//         res.sendStatus(serviceRes.status)
//         return
//     }
//     res.status(serviceRes.status).json(serviceRes.data)
// })

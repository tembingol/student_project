"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postValidators = exports.findPostValidator = exports.blogIdValidator = exports.contentValidator = exports.shortDescriptionValidator = exports.titleValidator = void 0;
const express_validator_1 = require("express-validator");
const input_Check_Errors_Middleware_1 = require("../../../global-middlewares/input-Check-Errors-Middleware");
const base_auth_middleware_1 = require("../../../global-middlewares/base-auth-middleware");
const posts_repository_1 = require("../posts-repository");
const blogs_repository_1 = require("../../blogs/blogs-repository");
// title: string // max 30
// shortDescription: string // max 100
// content: string // max 1000
// blogId: string // valid
exports.titleValidator = (0, express_validator_1.body)('title')
    .isString().withMessage('not string')
    .trim()
    .isLength({ min: 1, max: 30 }).withMessage('more then 30 or 0');
exports.shortDescriptionValidator = (0, express_validator_1.body)('shortDescription')
    .isString().withMessage('not string')
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('more then 100 or 0');
exports.contentValidator = (0, express_validator_1.body)('content')
    .isString().withMessage('not string')
    .trim()
    .isLength({ min: 1, max: 1000 }).withMessage('more then 1000 or 0');
exports.blogIdValidator = (0, express_validator_1.body)('blogId')
    .isString().withMessage('not string')
    .trim().custom(blogId => {
    const blog = blogs_repository_1.blogsRepository.getBlogByID(blogId);
    // console.log(blog)
    return !!blog;
    //return true
}).withMessage('no blog');
const findPostValidator = (req, res, next) => {
    const post = posts_repository_1.postsRepository.getPostByID(req.params.id);
    if (!post) {
        res
            .status(404)
            .json({});
        return;
    }
    next();
};
exports.findPostValidator = findPostValidator;
exports.postValidators = [
    base_auth_middleware_1.baseAuthMiddleware,
    exports.blogIdValidator,
    exports.titleValidator,
    exports.shortDescriptionValidator,
    exports.contentValidator,
    input_Check_Errors_Middleware_1.inputCheckErrorsMiddleware,
];

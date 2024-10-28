"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogValidators = exports.blogIdValidator = exports.websiteUrlValidator = exports.descriptionValidator = exports.nameValidator = void 0;
const express_validator_1 = require("express-validator");
const input_Check_Errors_Middleware_1 = require("../../../global-middlewares/input-Check-Errors-Middleware");
const base_auth_middleware_1 = require("../../../global-middlewares/base-auth-middleware");
const blogs_repository_1 = require("../blogs-repository");
// name: string // max 15
// description: string // max 500
// websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
exports.nameValidator = (0, express_validator_1.body)('name')
    .isString().withMessage('not string')
    .trim()
    .isLength({ min: 1, max: 15 }).withMessage('more then 15 or 0');
exports.descriptionValidator = (0, express_validator_1.body)('description')
    .isString().withMessage('not string')
    .trim()
    .isLength({ min: 1, max: 500 }).withMessage('more then 500 or 0');
exports.websiteUrlValidator = (0, express_validator_1.body)('websiteUrl')
    .isString().withMessage('not string')
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('more then 100 or 0')
    .isURL().withMessage('not url');
//export const findBlogValidator = (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
exports.blogIdValidator = (0, express_validator_1.body)('blogId').isString().withMessage('not string')
    .trim().custom(blogId => {
    const blog = blogs_repository_1.blogsRepository.getBlogByID(blogId);
    // console.log(blog)
    return !!blog;
}).withMessage('no blog');
//next()
//}
exports.blogValidators = [
    base_auth_middleware_1.baseAuthMiddleware,
    exports.nameValidator,
    exports.descriptionValidator,
    exports.websiteUrlValidator,
    input_Check_Errors_Middleware_1.inputCheckErrorsMiddleware,
];

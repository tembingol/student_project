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
exports.postValidators = exports.blogIdValidator = exports.contentValidator = exports.shortDescriptionValidator = exports.titleValidator = exports.blogNameValidator = void 0;
const express_validator_1 = require("express-validator");
const input_Check_Errors_Middleware_1 = require("../../../global-middlewares/input-Check-Errors-Middleware");
const base_auth_middleware_1 = require("../../../global-middlewares/base-auth-middleware");
const composition_root_1 = require("../../../composition-root");
const blogs_query_service_1 = require("../../blogs/services/blogs-query-service");
exports.blogNameValidator = (0, express_validator_1.body)('blogName')
    .isString().withMessage('not string');
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
    .trim().custom((blogId) => __awaiter(void 0, void 0, void 0, function* () {
    const blogsQueryService = composition_root_1.container.get(blogs_query_service_1.BlogsQueryService);
    const foundBlog = yield blogsQueryService.findBlogById(blogId);
    if (!foundBlog.result) {
        throw new Error('no blog');
    }
    return true;
})).withMessage("no blog");
exports.postValidators = [
    base_auth_middleware_1.baseAuthMiddleware,
    exports.blogIdValidator,
    exports.titleValidator,
    exports.shortDescriptionValidator,
    exports.contentValidator,
    input_Check_Errors_Middleware_1.inputCheckErrorsMiddleware,
];

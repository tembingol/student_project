import { body } from 'express-validator'
import { inputCheckErrorsMiddleware } from '../../../global-middlewares/input-Check-Errors-Middleware'
import { NextFunction, Request, Response } from 'express'
import { baseAuthMiddleware } from '../../../global-middlewares/base-auth-middleware'
import { blogsQueryService } from '../../blogs/services/blogs-query-service'


export const blogNameValidator = body('blogName')
    .isString().withMessage('not string')
export const titleValidator = body('title')
    .isString().withMessage('not string')
    .trim()
    .isLength({ min: 1, max: 30 }).withMessage('more then 30 or 0')
export const shortDescriptionValidator = body('shortDescription')
    .isString().withMessage('not string')
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('more then 100 or 0')
export const contentValidator = body('content')
    .isString().withMessage('not string')
    .trim()
    .isLength({ min: 1, max: 1000 }).withMessage('more then 1000 or 0')
export const blogIdValidator = body('blogId')
    .isString().withMessage('not string')
    .trim().custom(async (blogId) => {
        const foundBlog = await blogsQueryService.findBlogById(blogId)
        if (!foundBlog.result) {
            throw new Error('no blog');
        }
        return true
    }).withMessage("no blog")

async function myValodator(id: string) {
    const foundBlog = await blogsQueryService.findBlogById(id)
    if (!foundBlog.result) {
        return false
    }
    return false
}

export const postValidators = [
    baseAuthMiddleware,

    //blogNameValidator,
    blogIdValidator,
    titleValidator,
    shortDescriptionValidator,
    contentValidator,

    inputCheckErrorsMiddleware,
]
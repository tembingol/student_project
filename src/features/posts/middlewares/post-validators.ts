import { body } from 'express-validator'
import { inputCheckErrorsMiddleware } from '../../../global-middlewares/input-Check-Errors-Middleware'
import { NextFunction, Request, Response } from 'express'
import { baseAuthMiddleware } from '../../../global-middlewares/base-auth-middleware'
import { postsRepository } from '../posts-repository'
import { blogsRepository } from '../../blogs/blogs-repository'
// title: string // max 30
// shortDescription: string // max 100
// content: string // max 1000
// blogId: string // valid

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
        const foundBlog = await blogsRepository.getBlogByID(blogId)

        if (foundBlog == false) {
            throw new Error('no blog');
        }
        return true
    }).withMessage("no blog")

async function myValodator(id: string) {
    const foundBlog = await blogsRepository.getBlogByID(id)
    if (foundBlog == false) {
        return false
    }
    return false
}

// export const findPostValidator = (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
//     const post = postsRepository.getPostByID(req.params.id)
//     if (!post) {

//         res
//             .status(404)
//             .json({})
//         return
//     }

//     next()
// }

export const postValidators = [
    baseAuthMiddleware,

    //blogNameValidator,
    blogIdValidator,
    titleValidator,
    shortDescriptionValidator,
    contentValidator,

    inputCheckErrorsMiddleware,
]
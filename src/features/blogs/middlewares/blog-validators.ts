import { body } from 'express-validator'
import { inputCheckErrorsMiddleware } from '../../../global-middlewares/input-Check-Errors-Middleware'
import { NextFunction, Request, Response } from 'express'
import { baseAuthMiddleware } from '../../../global-middlewares/base-auth-middleware'
import { blogsRepository } from '../blogs-repository'

// name: string // max 15
// description: string // max 500
// websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$

export const nameValidator = body('websiteUrl')
    .isString().withMessage('not string')
    .trim()
    .isLength({ min: 1, max: 15 }).withMessage('more then 15 or 0')
export const descriptionValidator = body('description')
    .isString().withMessage('not string')
    .trim()
    .isLength({ min: 1, max: 500 }).withMessage('more then 500 or 0')
export const websiteUrlValidator = body('websiteUrl')
    .isString().withMessage('not string')
    .trim()
    .isURL().withMessage('not url')
    .isLength({ min: 1, max: 100 }).withMessage('more then 100 or 0')


//export const findBlogValidator = (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
export const blogIdValidator = body('blogId').isString().withMessage('not string')
    .trim().custom(blogId => {
        const blog = blogsRepository.getBlogByID(blogId)
        // console.log(blog)
        return !!blog
    }).withMessage('no blog')

//next()
//}


export const blogValidators = [
    baseAuthMiddleware,

    nameValidator,
    descriptionValidator,
    websiteUrlValidator,

    inputCheckErrorsMiddleware,
]
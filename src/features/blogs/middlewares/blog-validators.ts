import { body } from 'express-validator'
import { inputCheckErrorsMiddleware } from '../../../global-middlewares/input-Check-Errors-Middleware'
import { baseAuthMiddleware } from '../../../global-middlewares/base-auth-middleware'

// name: string // max 15
// description: string // max 500
// websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$

export const nameValidator = body('name')
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
    .isLength({ min: 1, max: 100 }).withMessage('more then 100 or 0')
    .isURL().withMessage('not url')

export const blogValidators = [
    baseAuthMiddleware,

    nameValidator,
    descriptionValidator,
    websiteUrlValidator,

    inputCheckErrorsMiddleware,
]
import { body } from 'express-validator'
import { inputCheckErrorsMiddleware } from '../../../global-middlewares/input-Check-Errors-Middleware'

export const commentContetValidator = body('content')
    .isString().withMessage('not string')
    .trim()
    .isLength({ min: 20, max: 300 }).withMessage('more then 300 or less 20')

export const commentValidators = [

    commentContetValidator,
    inputCheckErrorsMiddleware,

]
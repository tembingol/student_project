import { body, header } from 'express-validator'
import { inputCheckErrorsMiddleware } from '../../../global-middlewares/input-Check-Errors-Middleware'
import { NextFunction, Request, Response } from 'express'

export const loginOrEmailValidator = body('loginOrEmail')
    .isString().withMessage('not string')
export const passwordValidator = body('password')
    .isString().withMessage('not string')

export const authValidators = [

    loginOrEmailValidator,
    passwordValidator,

    inputCheckErrorsMiddleware,
]



export const authHeaderValidator = header('Authorization'.toLowerCase())
    .isString().withMessage('not string')
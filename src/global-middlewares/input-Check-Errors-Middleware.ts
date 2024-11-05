import { Response, Request, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { FieldNamesType, OutputErrorsType } from '../input-output-types/otput-errors-model'

export const inputCheckErrorsMiddleware = (req: Request, res: Response<OutputErrorsType>, next: NextFunction) => {
    const e = validationResult(req)
    if (!e.isEmpty()) {
        const eArray = e.array({ onlyFirstError: true }) as { path: FieldNamesType, msg: string }[]
        //console.log(eArray)

        res
            .status(400)
            .json({
                errorsMessages: eArray.map(x => ({ message: x.msg, field: x.path }))
            })
        return
    }

    next()
}
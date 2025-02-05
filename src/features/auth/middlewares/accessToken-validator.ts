import { Request, Response, NextFunction } from "express"
import { HTTP_STATUS_CODE } from "../../../input-output-types/types"
import { jwtService } from "../../../application-services/JWT-service"


// Middleware to validate accessToken
export const accessTokenValidator = async (req: Request, res: Response, next: NextFunction) => {

    const authorization = req.headers.authorization

    if (!authorization) {
        res.status(HTTP_STATUS_CODE.Unauthorized).json({
            errorsMessages: [
                { message: 'accessToken is not valid ', field: 'accessToken' }
            ]
        })
        return
    }

    const accessToken = authorization.split(' ')[1]

    const playLoad = await jwtService.tokenVerify(accessToken)

    if (playLoad === null || playLoad.userId === undefined) {
        res.status(HTTP_STATUS_CODE.Unauthorized).json({
            errorsMessages: [
                { message: 'accessToken is not valid ', field: 'accessToken' }
            ]
        })
        return
    }

    if (req.context) {
        req.context.currentUser = { userId: playLoad.userId, userLogin: playLoad.userLogin }
    }

    next()
}
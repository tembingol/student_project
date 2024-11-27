import { Router } from "express"
import { authHeaderValidator, authValidators } from "./middlewares/auth-validators"
import { usersQueryRepository } from "../users/users-query-repo"
import bcrypt from "bcrypt"
import { jwtService } from "../../application-services/JWT-service"
import { authService } from "./services/auth-service"

export const authRouter = Router({})

// // simple logger for this router's requests
// // all requests to this router will first hit this middleware
// authRouter.use(function (req, res, next) {
//     console.log('authRouter Logger \n{--')
//     console.log('%s ,%s ,%s', req.method, req.body, req.baseUrl + req.url)
//     console.log('--}')
//     next()
// })

authRouter.post('/login', ...authValidators, async (req, res) => {

    const result = await authService.checkUserCredintails(req.body)

    if (result === null) {
        res.sendStatus(401)
        return
    }

    const userToken = await jwtService.createJWT(result)

    res.status(200).send(userToken)
})

authRouter.get('/login/me', async (req, res) => {

    const authorization = req.headers['Authorization'.toLowerCase()]

    // console.log("authorization " + authorization)

    if (typeof authorization == "undefined") {
        res.sendStatus(401)
        return
    }

    const token = authorization.slice(7)

    const foundUser = await authService.getUserByToken(token.toString())

    if (foundUser === null) {
        res.sendStatus(401)
        return
    }

    res.status(201).send(foundUser)

    return

})
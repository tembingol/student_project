import { Router } from "express"
import { authValidators } from "./middlewares/auth-validators"
import { usersQueryRepository } from "../users/users-query-repo"
import bcrypt from "bcrypt"

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

    // isEmail =  (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(req.body.loginOrEmail.trim())) 

    let foundUser = await usersQueryRepository.getUserByLogin(req.body.loginOrEmail.trim())

    if (foundUser == null) {
        foundUser = await usersQueryRepository.getUserByEmail(req.body.loginOrEmail.trim())
    }

    if (foundUser == null) {
        res.sendStatus(401)
        return
    }

    const userCredentials = await usersQueryRepository.getUserCredentials(foundUser.id)

    if (userCredentials == null) {
        res.sendStatus(401)
        return
    }

    const userHash = bcrypt.hashSync(req.body.password, userCredentials.salt)

    if (userHash !== userCredentials!.hash) {
        res.sendStatus(401)
        return
    }

    res.sendStatus(204)
})
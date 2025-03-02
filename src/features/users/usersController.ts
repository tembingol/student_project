import { Request, Response } from "express"
import { UsersService } from "./services/usersService"
import { UsersQueryService } from "./services/usersQueryService"

export class UsersController {

    constructor(
        private usersService: UsersService,
        private usersQueryService: UsersQueryService
    ) { }


    async findUsers(req: Request, res: Response) {
        const serviceRes = await this.usersQueryService.findUsers(req.query)
        res.status(serviceRes.status).json(serviceRes.data)
    }

    async createUser(req: Request, res: Response) {
        const serviceRes = await this.usersService.createUser(req.body, true)

        if (serviceRes.result) {
            res.status(serviceRes.status).json(serviceRes.data)
            return
        }

        res.status(serviceRes.status).json(serviceRes.errors)
    }

    async deleteUser(req: Request, res: Response) {
        const serviceRes = await this.usersService.deleteUser(req.params.id)
        if (serviceRes.result) {
            res.status(serviceRes.status).json(serviceRes.data)
            return
        }

        res.sendStatus(serviceRes.status)
    }


}
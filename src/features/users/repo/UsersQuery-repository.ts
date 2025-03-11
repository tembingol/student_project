import { ObjectId } from "mongodb"
import { db } from "../../../db/db"
import { injectable } from "inversify"

@injectable()
export class UsersQueryRepository {

    async getUserCredentials(filter: any) {
        const fresult = await db.getCollections().usersCredentialsCollection.findOne(filter)
        return fresult
    }

    async getUserByLogin(login: string) {
        const filter = { login: login }
        const foundUser = await db.getCollections().usersCollection.findOne(filter)
        return foundUser
    }

    async getUserByEmail(email: string) {
        const filter = { email: email }
        const foundUser = await db.getCollections().usersCollection.findOne(filter)
        return foundUser
    }

    async getUserById(id: string) {
        const filter = { _id: new ObjectId(id) }
        const foundUser = await db.getCollections().usersCollection.findOne(filter)
        return foundUser
    }

    async getUserByConfirmationCode(code: string) {
        const filter = { 'emailConfirmation.confirmationCode': code }
        const foundUser = await db.getCollections().usersCollection.findOne(filter)
        return foundUser
    }

    async getAllUsers(pageNumber: Number, pageSize: Number, sortBy: string, sortDirection: string, filter: {},) {
        const _pageNumber = +pageNumber
        const _pageSize = +pageSize
        const _sortDirection = sortDirection === 'asc' ? 1 : -1

        const allUsers = await db.getCollections().usersCollection.find(filter)
            .skip((_pageNumber - 1) * _pageSize)
            .limit(_pageSize)
            .sort({ [sortBy]: _sortDirection })
            .toArray()

        return allUsers
    }

    async getDocumetnsCount(filter: {}) {
        return await db.getCollections().usersCollection.countDocuments(filter)
    }
}
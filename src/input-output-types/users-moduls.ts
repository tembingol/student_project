import { ObjectId } from "mongodb"

export type LoginInputModel = {
    loginOrEmail: string,
    password: string
}

export type UserInputModel = {
    login: string,//maxLength: 10 minLength: 3 pattern: ^[a-zA-Z0-9_-]*$ must be unique
    password: string, //maxLength: 20 minLength: 6
    email: string,//pattern: string, //^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$ example: string, // example@example.com must be unique
}

export type UserViewModel = {
    _id: ObjectId
    id: string
    login: string
    email: string
    createdAt: Date
}

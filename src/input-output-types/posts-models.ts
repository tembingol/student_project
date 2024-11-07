import { ObjectId } from "mongodb"

export type PostInputModel = {
    title: string // max 30
    shortDescription: string // max 100
    content: string // max 1000
    blogId: string // valid
    blogName: string
}

export type PostViewModel = {
    _id: ObjectId
    id: string
    title: string // max 30
    shortDescription: string // max 100
    content: string // max 1000
    blogId: string // valid
    blogName: string
    createdAt: string,//($date-time))
}
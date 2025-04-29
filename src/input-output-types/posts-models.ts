import { ObjectId, WithId } from "mongodb"
import mongoose from "mongoose"
import { SETTINGS } from "../settings"

export type PostInputModel = {
    title: string // max 30
    shortDescription: string // max 100
    content: string // max 1000
    blogId: string // valid
    blogName: string
}

export type PostViewModel = {
    id: string
    title: string // max 30
    shortDescription: string // max 100
    content: string // max 1000
    blogId: string // valid
    blogName: string
    createdAt: string,//($date-time))
}

export type PostDataBaseModel = {
    _id: ObjectId
    id: string
    title: string // max 30
    shortDescription: string // max 100
    content: string // max 1000
    blogId: string // valid
    blogName: string
    createdAt: string,//($date-time))
}

const PostSchema = new mongoose.Schema<WithId<PostViewModel>>({
    id: { type: String, require: true },
    title: { type: String, require: true, max: 30 },
    shortDescription: { type: String, require: true, max: 100 },
    content: { type: String, require: true, max: 1000 },
    blogId: { type: String, require: true },
    blogName: { type: String, require: true, max: 30 },
    createdAt: { type: String, require: true, default: new Date().toISOString() },
})

export const PostModel = mongoose.model<WithId<PostViewModel>>(SETTINGS.POST_COLLECTION_NAME, PostSchema)
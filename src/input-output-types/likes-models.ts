import { WithId } from "mongodb"
import mongoose from "mongoose"
import { LikeStatus } from "./types"
import { SETTINGS } from "../settings"

export type LikeImputModel = {
    likeStatus: LikeStatus
}

export type LikestModel = {
    userId: string
    objectId: string
    createdAt: Date
    status: LikeStatus
}

export type LikesInfoModel = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus
}

const LikesSchema = new mongoose.Schema<WithId<LikestModel>>({
    userId: { type: String, require: true, max: 15 },
    objectId: { type: String, require: false, default: '', max: 500 },
    createdAt: { type: Date, require: true, default: new Date() },
    status: { type: String, require: true, default: LikeStatus.NONE }
})

export const LikeModel = mongoose.model<WithId<LikestModel>>(SETTINGS.LIKES_COLLECTION_NAME, LikesSchema)
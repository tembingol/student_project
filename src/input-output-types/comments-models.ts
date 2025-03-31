import { WithId } from "mongodb"
import { LikesInfoModel } from "./likes-models"
import mongoose from "mongoose"
import { LikeStatus } from "./types"

export type CommentatorInfo = {
    userId: string
    userLogin: string
}

export type CommentInputModel = {
    content: string //maxLength: 300 minLength: 20
}

export type CommentDataBaseModel = {
    _id: string
    id: string
    postId: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
    likesInfo?: LikesInfoModel
}

export type CommentViewModel = {
    postId: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
    likesInfo: LikesInfoModel
}

const CommentSchema = new mongoose.Schema<WithId<CommentViewModel>>({
    postId: { type: String, require: true },
    content: { type: String, require: true, maxLength: 300, minLength: 20 },
    commentatorInfo: { type: Object, require: true },
    createdAt: { type: String, require: true, default: new Date().toISOString() },
    likesInfo: { type: Object, require: false, defuult: { likesCount: 0, dislikesCount: 0, myStatus: LikeStatus.NONE } }
})

CommentSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        delete ret.postId
        return ret
    }
})

export const CommentModel = mongoose.model<WithId<CommentViewModel>>('comments', CommentSchema)
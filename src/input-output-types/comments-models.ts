import { ObjectId } from "mongodb"

export type CommentatorInfo = {
    userId: string
    userLogin: string
}

export type CommentInputModel = {
    content: string //maxLength: 300 minLength: 20
}

export type CommentViewModel = {
    id: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
}

export type CommentDataBaseModel = {
    _id?: ObjectId
    postId: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
}

// const CommentSchema = new mongoose.Schema<WithId<CommentDataBaseModel>>({
//     postId: { type: String, require: true },
//     content: { type: String, require: true, maxLength: 300, minLength: 20 },
//     commentatorInfo: { type: Object, require: true },
//     createdAt: { type: String, require: true, default: new Date().toISOString() },
// })
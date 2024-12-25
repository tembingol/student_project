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
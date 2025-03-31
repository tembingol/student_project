import { injectable } from "inversify";
import { LikeModel, LikesInfoModel } from "../../../input-output-types/likes-models";
import { HTTP_STATUS_CODE, LikeStatus } from "../../../input-output-types/types";

@injectable()
export class LikesService {
    constructor() { }

    async updateLikeStatus(objectId: string, reqBody: any, userId: string) {

        const serviceResult = {
            result: false,
            status: HTTP_STATUS_CODE.BadRequest,
            data: {},
            errors: { errorsMessages: [{ message: 'likeStatus is required', field: 'likeStatus' }] }
        }

        if (!reqBody.likeStatus) {
            return serviceResult
        }

        const likeStatus: LikeStatus = reqBody.likeStatus

        if (!Object.values(LikeStatus).includes(likeStatus)) {
            serviceResult.errors = { errorsMessages: [{ message: 'likeStatus is invalid', field: 'likeStatus' }] }
            return serviceResult
        }

        let newLike = await LikeModel.findOne().where('userId').equals(userId).where('objectId').equals(objectId).exec()
        if (!newLike) {
            newLike = new LikeModel()
        }

        newLike.status = likeStatus
        newLike.userId = userId
        newLike.objectId = objectId
        newLike.createdAt = new Date()

        await newLike.save()
        serviceResult.result = true
        serviceResult.status = HTTP_STATUS_CODE.NoContent
        serviceResult.data = newLike
        serviceResult.errors = { errorsMessages: [] }

        return serviceResult
    }

    async getLikesAndDislikesCount(objectId: string) {
        const result = {
            likesCount: 0,
            dislikesCount: 0,
        }

        result.likesCount = await this.getLikesCount(objectId)
        result.dislikesCount = await this.getDislikesCount(objectId)

        return true
    }

    async getLikesCount(objectId: string) {
        return await LikeModel.countDocuments().where('objectId').equals(objectId).where('status').equals(LikeStatus.LIKE).exec()
    }

    async getDislikesCount(objectId: string) {
        return await LikeModel.countDocuments().where('objectId').equals(objectId).where('status').equals(LikeStatus.DISLIKE).exec()
    }

    async getUserLikeStatus(objectId: string, userId: string) {
        const result = await LikeModel.findOne().where('userId').equals(userId).where('objectId').equals(objectId).exec()
        if (!result) {
            return LikeStatus.NONE
        }
        return result.status
    }

    async getLikesInfo(userId: string, objectId: string) {
        const result: LikesInfoModel = {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: LikeStatus.NONE
        }

        result.likesCount = await this.getLikesCount(objectId)
        result.dislikesCount = await this.getDislikesCount(objectId)
        result.myStatus = await this.getUserLikeStatus(objectId, userId)

        return result
    }
}